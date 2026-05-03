import Section from "../components/Section";
import { profile } from "../data/profile";

function TimelineItem({ left, title, subtitle, children }) {
    return (
        <div className="tItem">
            <div className="tLeft">{left}</div>
            <div className="tRight">
                <div className="tContent">
                    <div className="tTitle">{title}</div>
                    {subtitle ? <div className="tSub">{subtitle}</div> : null}
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function CoCurricular() {
    return (
        <div className="stack">
            <Section title="Skills & Tools" subtitle="Grouped for quick scanning">
                <div className="skillsGrid">
                    {Object.entries(profile.skills).map(([group, items]) => (
                        <div className="cardPro" key={group}>
                            <div className="cardTitle" style={{ marginBottom: '12px' }}>{group}</div>
                            <div className="pillRow" style={{ marginTop: 0 }}>
                                {items.map((i) => <span className="badge" key={i}>{i}</span>)}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Certifications">
                <div className="grid2">
                    {profile.certifications.map((c) => (
                        <article className="cardPro" key={c.title}>
                            <div className="cardTitle">{c.title}</div>
                            <div className="muted">{c.issuer}</div>
                        </article>
                    ))}
                </div>
            </Section>

            <Section title="Leadership & Organizations" subtitle="Positions and responsibilities">
                <div className="timeline">
                    {profile.leadership.map((org) => (
                        <div key={org.organization} style={{ marginBottom: '32px' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <div className="h3">{org.organization}</div>
                                <div className="muted small">{org.location}</div>
                            </div>
                            <div className="timeline">
                                {org.positions.map((pos) => (
                                    <TimelineItem
                                        key={`${pos.role}-${pos.period}`}
                                        left={pos.period}
                                        title={pos.role}
                                        subtitle={pos.duration + (pos.type ? ` · ${pos.type}` : '')}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Minor Specialization Courses">
                <ul className="list">
                    {profile.minorCourses.map((c) => (
                        <li key={c.title}>
                            <span className="strongish">{c.title}</span> — <span className="muted">{c.issuer}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section title="Honors & Awards">
                <ul className="list">
                    {profile.awards.map((a) => (
                        <li key={a.title}>
                            <span className="strongish">{a.title}</span> — <span className="muted">{a.issuer}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section title="Volunteering" subtitle="Community service and outreach">
                <div className="timeline">
                    {profile.volunteering.map((vol) => (
                        <TimelineItem
                            key={`${vol.role}-${vol.period}`}
                            left={vol.period}
                            title={vol.role}
                            subtitle={`${vol.organization} · ${vol.duration}`}
                        >
                            <div className="muted small">{vol.category}</div>
                        </TimelineItem>
                    ))}
                </div>
            </Section>
        </div>
    );
}
