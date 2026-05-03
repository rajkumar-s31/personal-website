import Section from "../components/Section";
import { profile } from "../data/profile";

export default function Contact() {
    const { contact } = profile;

    return (
        <div className="stack">
            <Section title="Contact">
                <div className="grid2">
                    <div className="cardPro">
                        <div className="muted small">Email</div>
                        <div className="cardTitle">
                            <a href={`mailto:${contact.email}`} className="link">{contact.email}</a>
                        </div>
                    </div>


                    <div className="cardPro">
                        <div className="muted small">LinkedIn</div>
                        <a className="link" href={contact.linkedin} target="_blank" rel="noreferrer">
                            LinkedIn Profile
                        </a>
                    </div>

                    <div className="cardPro">
                        <div className="muted small">Instagram</div>
                        <a className="link" href={contact.instagram} target="_blank" rel="noreferrer">
                            Instagram Profile
                        </a>
                    </div>
                </div>
            </Section>
        </div>
    );
}
