import { content } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="ft">
      <div className="ft__sheet">
        <div className="ft__inner">
          <p className="ft__mark" aria-hidden="true">
            {content.footer.first}
            <span className="ft__mark-second">{content.footer.second}</span>
          </p>

          <div className="ft__grid">
            <p className="ft__disclaimer">{content.footer.disclaimer}</p>

            {content.footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="ft__col-title">{col.title}</h2>
                <ul className="ft__col-list">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a className="ft__link" href={link.href}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="ft__legal">
            <span>{content.footer.legal}</span>
            <a href={content.footer.cta.href} className="btn btn--sm ft__cta">
              {content.footer.cta.label}
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
