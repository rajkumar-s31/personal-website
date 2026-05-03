import { Link } from "react-router-dom";
import Section from "../components/Section";
import { profile } from "../data/profile";

export default function Home() {
    return (
        <div className="stack">
            <section className="hero">
                <div className="heroGrid">
                    <div>
                        <h1 className="h1">{profile.headline}</h1>
                        <p className="lead" style={{ fontWeight: 'normal', color: 'var(--muted)' }}>{profile.summary}</p>

                        <div className="row">
                            <a className="btn" href="/assets/Resume.pdf" download="Vaseekaran_SL_Resume.pdf">
                                Download Resume
                            </a>
                            <Link className="btn ghost" to="/contact">Contact</Link>
                        </div>
                    </div>

                    <div className="profileCard" aria-label="Profile photo placeholder">
                        <div className="profilePhoto">
                            <img src={process.env.PUBLIC_URL + '/assets/profile.jpg'} alt={profile.name} />
                        </div>
                    </div>
                </div>
            </section>

            <Section
                title="Explore"
                subtitle="Three tracks: academic & professional, projects & skills, and creative interests."
            >
                <div className="cardGrid">
                    <Link className="card" to="/curricular">
                        <h3 className="h3">Curricular</h3>
                        <p className="muted">Education timeline, experience, academic achievements.</p>
                    </Link>

                    <Link className="card" to="/co-curricular">
                        <h3 className="h3">Co-Curricular</h3>
                        <p className="muted">Projects, talks, certifications, skills & tools.</p>
                    </Link>

                    <Link className="card" to="/extra-curricular">
                        <h3 className="h3">Extra-Curricular</h3>
                        <p className="muted">Photography, videography, archives & hobbies.</p>
                    </Link>
                </div>
            </Section>
        </div>
    );
}
