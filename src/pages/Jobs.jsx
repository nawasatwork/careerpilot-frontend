import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import JobCard from '../components/JobCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';

const COUNTRIES = [
    { code: 'PK', name: 'Pakistan' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'QA', name: 'Qatar' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SG', name: 'Singapore' },
    { code: 'MY', name: 'Malaysia' },
];

const EMPLOYMENT_TYPES = [
    { value: '', label: 'Any type' },
    { value: 'fulltime', label: 'Full-time' },
    { value: 'parttime', label: 'Part-time' },
    { value: 'contractor', label: 'Contract' },
    { value: 'intern', label: 'Internship' },
];

const DATE_WINDOWS = [
    { value: 'today', label: 'Today' },
    { value: '3days', label: 'Last 3 days' },
    { value: 'week', label: 'Last 7 days' },
    { value: 'month', label: 'Last 30 days' },
];

const LIMITS = [10, 20, 30];

const DEFAULTS = {
    role: 'Full Stack Developer',
    workMode: 'remote',
    country: 'PK',
    city: 'Islamabad',
    employmentType: '',
    datePosted: 'month',
    limit: 10,
    minScore: 6,
    freeOnly: false,
};

function toParams(filters) {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
        if (value === false || value === '' || value === null || value === undefined) {
            return;
        }
        params[key] = String(value);
    });
    return params;
}

function parseFilters(searchParams) {
    const limit = Number(searchParams.get('limit'));
    const minScore = Number(searchParams.get('minScore'));
    const employmentType = searchParams.get('employmentType') || '';

    return {
        role: searchParams.get('role') || DEFAULTS.role,
        workMode: searchParams.get('workMode') === 'onsite' ? 'onsite' : 'remote',
        country: searchParams.get('country') || DEFAULTS.country,
        city: searchParams.get('city') || DEFAULTS.city,
        employmentType: EMPLOYMENT_TYPES.some((type) => type.value === employmentType) ? employmentType : '',
        datePosted: DATE_WINDOWS.some((window) => window.value === searchParams.get('datePosted'))
            ? searchParams.get('datePosted')
            : DEFAULTS.datePosted,
        limit: LIMITS.includes(limit) ? limit : DEFAULTS.limit,
        minScore: [6, 7, 8].includes(minScore) ? minScore : DEFAULTS.minScore,
        freeOnly: searchParams.get('freeOnly') === '1',
    };
}

function Jobs() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    useDocumentTitle('Jobs');

    const [filters, setFilters] = useState(() => parseFilters(searchParams));
    const didAutoRun = useRef(false);

    const { data, loading, error, run } = useApi((params) =>
        api.get('/jobs/match', { params }).then((res) => res.data)
    );

    // Auto-search only when the URL already encodes a search (refresh, back, shared link).
    // A bare visit should not spend provider credits without intent.
    useEffect(() => {
        if (didAutoRun.current) {
            return;
        }
        didAutoRun.current = true;

        if (searchParams.toString().length > 0) {
            const initial = parseFilters(searchParams);
            run({
                ...initial,
                limit: Number(initial.limit),
                minScore: Number(initial.minScore),
                freeOnly: initial.freeOnly ? '1' : '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function setField(key, value) {
        setFilters((previous) => ({ ...previous, [key]: value }));
    }

    function handleSearch(event) {
        event.preventDefault();
        const normalized = {
            ...filters,
            role: filters.role.trim(),
            city: filters.city.trim(),
            limit: Number(filters.limit),
            minScore: Number(filters.minScore),
            freeOnly: filters.freeOnly ? '1' : '',
        };
        setSearchParams(toParams(normalized));
        run(normalized);
    }

    function resetFilters() {
        setFilters(DEFAULTS);
        setSearchParams({});
    }

    const jobs = data?.jobs ?? [];
    const hasSearched = data !== null;

    return (
        <>
            <Navbar />
            <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-8 focus:outline-none">
                <PageHeader
                    eyebrow="Search"
                    title="Job Matches"
                    subtitle="Scored against your resume by evidence, not vibes."
                />

                <form onSubmit={handleSearch} className="elevate mb-6 rounded-2xl border border-border bg-surface p-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="sm:col-span-2">
                            <label htmlFor="role" className="mb-1 block text-sm text-muted">Job role</label>
                            <Input
                                id="role"
                                name="role"
                                value={filters.role}
                                onChange={(e) => setField('role', e.target.value)}
                                placeholder="e.g. React Developer"
                            />
                        </div>

                        <div>
                            <label htmlFor="workMode" className="mb-1 block text-sm text-muted">Work mode</label>
                            <Select
                                id="workMode"
                                name="workMode"
                                value={filters.workMode}
                                onChange={(e) => setField('workMode', e.target.value)}
                            >
                                <option value="remote">Remote</option>
                                <option value="onsite">On-site</option>
                            </Select>
                        </div>

                        <div>
                            <label htmlFor="country" className="mb-1 block text-sm text-muted">Country</label>
                            <Select
                                id="country"
                                name="country"
                                value={filters.country}
                                onChange={(e) => setField('country', e.target.value)}
                            >
                                {COUNTRIES.map((country) => (
                                    <option key={country.code} value={country.code}>{country.name}</option>
                                ))}
                            </Select>
                        </div>

                        {filters.workMode === 'onsite' && (
                            <div>
                                <label htmlFor="city" className="mb-1 block text-sm text-muted">City</label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={filters.city}
                                    onChange={(e) => setField('city', e.target.value)}
                                    placeholder="Islamabad"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="employmentType" className="mb-1 block text-sm text-muted">Employment type</label>
                            <Select
                                id="employmentType"
                                name="employmentType"
                                value={filters.employmentType}
                                onChange={(e) => setField('employmentType', e.target.value)}
                            >
                                {EMPLOYMENT_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label htmlFor="datePosted" className="mb-1 block text-sm text-muted">Posted within</label>
                            <Select
                                id="datePosted"
                                name="datePosted"
                                value={filters.datePosted}
                                onChange={(e) => setField('datePosted', e.target.value)}
                            >
                                {DATE_WINDOWS.map((window) => (
                                    <option key={window.value} value={window.value}>{window.label}</option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label htmlFor="limit" className="mb-1 block text-sm text-muted">Results</label>
                            <Select
                                id="limit"
                                name="limit"
                                value={filters.limit}
                                onChange={(e) => setField('limit', Number(e.target.value))}
                            >
                                {LIMITS.map((limit) => (
                                    <option key={limit} value={limit}>{limit} jobs</option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label htmlFor="minScore" className="mb-1 block text-sm text-muted">Min match</label>
                            <Select
                                id="minScore"
                                name="minScore"
                                value={filters.minScore}
                                onChange={(e) => setField('minScore', Number(e.target.value))}
                            >
                                <option value={6}>6+ (good)</option>
                                <option value={7}>7+ (strong)</option>
                                <option value={8}>8+ (excellent)</option>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                        <p className="max-w-2xl text-xs text-muted">
                            We search using your resume&apos;s skills and only show jobs at or above your minimum match. Company sites and free boards rank first, and when one job is listed on both a paid and a free board you get the free link. Ticking free-only asks the provider for more pages so the list still fills. Remote closing dates are checked; on-site results are recency-filtered because the source has no “closed” flag.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <label htmlFor="freeOnly" className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                                <input
                                    id="freeOnly"
                                    type="checkbox"
                                    checked={filters.freeOnly}
                                    onChange={(e) => setField('freeOnly', e.target.checked)}
                                    className="h-4 w-4 rounded border-border bg-bg accent-accent"
                                />
                                Free listings first
                            </label>
                            <Button type="submit" disabled={loading}>
                                {loading && <Spinner className="h-3.5 w-3.5" />}
                                Search
                            </Button>
                        </div>
                    </div>
                </form>

                {error && <Alert className="mb-4">{error}</Alert>}

                {loading && (
                    <div className="grid gap-4" aria-hidden="true">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="shimmer h-36 rounded-2xl border border-border bg-surface" />
                        ))}
                    </div>
                )}

                {!loading && !error && !hasSearched && (
                    <EmptyState
                        title="Set your filters"
                        message="Choose a role and work mode, then press Search. We only fetch jobs when you ask."
                        action={<Button onClick={handleSearch}>Search jobs</Button>}
                    />
                )}

                {!loading && !error && hasSearched && jobs.length === 0 && (
                    <EmptyState
                        title="No open matches"
                        message="Try a wider date range, another country, a lower minimum match, or a different role."
                        action={<Button variant="secondary" onClick={resetFilters}>Reset filters</Button>}
                    />
                )}

                {!loading && jobs.length > 0 && (
                    <>
                        <p aria-live="polite" className="mb-3 text-sm text-muted">
                            {jobs.length} {jobs.length === 1 ? 'match' : 'matches'}
                        </p>
                        <div className="grid gap-4">
                            {jobs.map((job, index) => (
                                <JobCard
                                    key={`${job.company}-${job.title}-${index}`}
                                    job={job}
                                    style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                                    onCoverLetter={() => navigate('/cover-letter', { state: { job } })}
                                    onInterview={() => navigate('/interview-prep', { state: { job } })}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </>
    );
}

export default Jobs;
