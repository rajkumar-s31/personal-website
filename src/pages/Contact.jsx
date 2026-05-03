import Section from "../components/Section";
import { profile } from "../data/profile";

export default function Contact() {
    const { contact } = profile;
    const currentAddress = `10/13, Bajanai Koil Street, East Mada Street, 
    Koyambedu, Chennai, Tamil Nadu, India.
    Pincode: 600107.`;
    const permanentAddress = `719, Vellikundrampatti, Melavannarippu,
    S.Pudur Union, Singampunari Taluk,
    Sivaganga, Tamil Nadu, India.
    Pincode: 630410.`;

    return (
        <div className="stack">
            <Section title="Contact">
                <div className="grid2">
                    <div className="cardPro">
                        <div className="muted small">Email</div>
                        <div className="cardTitle">
                            <a
                                href={`mailto:${contact.email}`}
                                className="link"
                                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <span>{contact.email}</span>
                            </a>
                        </div>
                    </div>


                    <div className="cardPro">
                        <div className="muted small">LinkedIn</div>
                        <a
                            className="link"
                            href={contact.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                            <span>{contact.linkedin}</span>
                        </a>
                    </div>

                    <div className="cardPro">
                        <div className="muted small">GitHub</div>
                        <a
                            className="link"
                            href={contact.github}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3.5 8.5c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                            </svg>
                            <span>{contact.github}</span>
                        </a>
                    </div>

                    <div className="cardPro">
                        <div className="muted small">Instagram</div>
                        <a
                            className="link"
                            href={contact.instagram}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                            <span>{contact.instagram}</span>
                        </a>
                    </div>

                    <div className="cardPro">
                        <div className="muted small">Facebook</div>
                        <a
                            className="link"
                            href={contact.facebook}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                            <span>{contact.facebook}</span>
                        </a>
                    </div>

                    <div className="cardPro">
                        <div className="muted small">X</div>
                        <a
                            className="link"
                            href={contact.twitter || contact.x}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                            <span>{contact.twitter || contact.x}</span>
                        </a>
                    </div>

                    <div className="cardPro">
                        <div className="muted small">Current Address</div>
                        <div style={{ display: "inline-flex", alignItems: "flex-start", gap: "8px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginTop: "2px" }}>
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <div className="link" style={{ whiteSpace: "pre-line" }}>{currentAddress}</div>
                        </div>
                    </div>

                    <div className="cardPro">
                        <div className="muted small">Permanent Address</div>
                        <div style={{ display: "inline-flex", alignItems: "flex-start", gap: "8px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginTop: "2px" }}>
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <div className="link" style={{ whiteSpace: "pre-line" }}>{permanentAddress}</div>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}
