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

export default function Curricular() {
    return (
        <div className="stack">
            <Section title="Professional Experience" subtitle="Roles and responsibilities">
                <div className="timeline">
                    {profile.experience.map((x) => (
                        <TimelineItem
                            key={`${x.company}-${x.role}-${x.period}`}
                            left={x.period}
                            title={x.role}
                            subtitle={x.company}
                        >
                            <ul className="list">
                                {x.bullets.map((b) => (
                                    <li key={b}>{b}</li>
                                ))}
                            </ul>
                            <div className="pillRow">
                                {x.tags.map((t) => (
                                    <span className="badge" key={t}>{t}</span>
                                ))}
                            </div>
                        </TimelineItem>
                    ))}
                </div>
            </Section>

            <Section title="Education" subtitle="Academic timeline">
                <div className="timeline">
                    {profile.education.map((e) => (
                        <TimelineItem
                            key={`${e.institute}-${e.period}`}
                            left={e.period}
                            title={e.institute}
                            subtitle={e.program}
                        >
                            <ul className="list">
                                {e.highlights.map((h) => (
                                    <li key={h}>{h}</li>
                                ))}
                            </ul>
                        </TimelineItem>
                    ))}
                </div>
            </Section>

            <Section title="Publications">
                <div className="grid2">
                    {profile.publications.map((p) => (
                        <article className="cardPro" key={p.title}>
                            <div className="cardTitle">{p.title}</div>
                            <div className="muted">{p.date}</div>
                        </article>
                    ))}
                </div>
            </Section>

            <Section title="Projects" subtitle="Selected technical work">
                <div className="grid2">
                    {profile.projects.map((p) => (
                        <article className="cardPro" key={p.title}>
                            <div className="cardTitle">{p.title}</div>
                            <ul className="list">
                                {p.bullets.map((b) => <li key={b}>{b}</li>)}
                            </ul>
                            <div className="pillRow">
                                {p.tags.map((t) => <span className="badge" key={t}>{t}</span>)}
                            </div>
                        </article>
                    ))}
                </div>
            </Section>
        </div>
    );
}
