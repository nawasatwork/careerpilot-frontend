import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api, getErrorMessage } from '../lib/api';
import { useToast } from '../lib/useToast';

const EMPTY_FORM = {
    name: '',
    currentRole: '',
    targetRole: '',
    location: '',
    experience: '',
    linkedinUrl: '',
    githubUrl: '',
};

function Field({ label, hint, children }) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm text-muted">{label}</span>
            {children}
            {hint && <span className="mt-1 block text-xs text-muted/80">{hint}</span>}
        </label>
    );
}

function Profile() {
    useDocumentTitle('Profile');
    const { toast } = useToast();

    const [form, setForm] = useState(EMPTY_FORM);
    const [skills, setSkills] = useState([]);
    const [skillDraft, setSkillDraft] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                const { data } = await api.get('/profile');
                if (!active) {
                    return;
                }
                setForm({
                    name: data.name || '',
                    currentRole: data.currentRole || '',
                    targetRole: data.targetRole || '',
                    location: data.location || '',
                    experience: data.experience ?? '',
                    linkedinUrl: data.linkedinUrl || '',
                    githubUrl: data.githubUrl || '',
                });
                setSkills(data.skills || []);
                setEmail(data.email || '');
            } catch (err) {
                if (active) {
                    setError(getErrorMessage(err, 'Could not load your profile'));
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, []);

    function setField(key, value) {
        setForm((previous) => ({ ...previous, [key]: value }));
    }

    function addSkill() {
        const value = skillDraft.trim();
        if (!value) {
            return;
        }
        setSkills((list) => {
            if (list.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
                return list;
            }
            return [...list, value].slice(0, 30);
        });
        setSkillDraft('');
    }

    function removeSkill(skill) {
        setSkills((list) => list.filter((item) => item !== skill));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSaving(true);
        try {
            await api.put('/profile', {
                name: form.name.trim(),
                currentRole: form.currentRole.trim(),
                targetRole: form.targetRole.trim(),
                location: form.location.trim(),
                experience: form.experience === '' ? undefined : Number(form.experience),
                linkedinUrl: form.linkedinUrl.trim(),
                githubUrl: form.githubUrl.trim(),
                skills,
            });
            toast('Profile saved. Matching will use your updated skills.');
        } catch (err) {
            setError(getErrorMessage(err, 'Could not save your profile'));
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-10 text-muted">
                    <Spinner /> Loading your profile
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-4 py-8 focus:outline-none">
                <PageHeader
                    eyebrow="Profile"
                    title="Your details"
                    subtitle="Matching uses these fields. Fix anything the resume parser got wrong."
                />

                {error && <Alert className="mb-4">{error}</Alert>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Card>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Name">
                                <Input value={form.name} onChange={(e) => setField('name', e.target.value)} required />
                            </Field>

                            <Field label="Email" hint="Contact support to change your sign-in email.">
                                <Input value={email} readOnly disabled className="opacity-70" />
                            </Field>

                            <Field label="Current role">
                                <Input
                                    value={form.currentRole}
                                    onChange={(e) => setField('currentRole', e.target.value)}
                                    placeholder="Frontend Developer"
                                />
                            </Field>

                            <Field label="Target role" hint="A short job title, used to search jobs.">
                                <Input
                                    value={form.targetRole}
                                    onChange={(e) => setField('targetRole', e.target.value)}
                                    placeholder="Full Stack Developer"
                                />
                            </Field>

                            <Field label="Location">
                                <Input
                                    value={form.location}
                                    onChange={(e) => setField('location', e.target.value)}
                                    placeholder="Islamabad, Pakistan"
                                />
                            </Field>

                            <Field label="Years of experience" hint="0 to 60.">
                                <Input
                                    type="number"
                                    min="0"
                                    max="60"
                                    value={form.experience}
                                    onChange={(e) => setField('experience', e.target.value)}
                                    placeholder="2"
                                />
                            </Field>

                            <Field label="LinkedIn URL">
                                <Input
                                    type="url"
                                    value={form.linkedinUrl}
                                    onChange={(e) => setField('linkedinUrl', e.target.value)}
                                    placeholder="https://linkedin.com/in/you"
                                />
                            </Field>

                            <Field label="GitHub URL">
                                <Input
                                    type="url"
                                    value={form.githubUrl}
                                    onChange={(e) => setField('githubUrl', e.target.value)}
                                    placeholder="https://github.com/you"
                                />
                            </Field>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Skills</h2>
                            <span className="text-xs text-muted">{skills.length}/30</span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {skills.length > 0 ? (
                                skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            aria-label={`Remove ${skill}`}
                                            className="rounded-full text-accent/70 transition-colors hover:text-accent"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-muted">No skills yet. Add the ones that should be matched.</p>
                            )}
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Input
                                value={skillDraft}
                                onChange={(e) => setSkillDraft(e.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        addSkill();
                                    }
                                }}
                                placeholder="Add a skill, e.g. React"
                                aria-label="Add a skill"
                            />
                            <Button variant="secondary" onClick={addSkill} disabled={!skillDraft.trim()}>
                                Add
                            </Button>
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                            {saving && <Spinner className="h-3.5 w-3.5" />}
                            Save profile
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

export default Profile;
