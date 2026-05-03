export default function Section({ title, subtitle, children }) {
    return (
        <section className="section">
            <div className="sectionHead">
                <h2 className="h2">{title}</h2>
                {subtitle ? <p className="muted">{subtitle}</p> : null}
            </div>
            <div className="sectionBody">{children}</div>
        </section>
    );
}
