import { FormEvent, useEffect, useMemo, useState, useCallback } from 'react';
import {
  ArrowRight, ArrowUpRight, Bot, Check, ChevronDown, Code2, Database, Globe2, Github, Hexagon,
  Instagram, Layers3, Linkedin, LockKeyhole, Menu, MessageCircle, Monitor, Network, Rocket, Send, ShieldCheck,
  Smartphone, Sparkles, X, Zap,
} from 'lucide-react';
import { localeNames, Locale, translations } from './locales';
// Função que remove elementos flutuantes com estilos específicos
const removeFloating = () => {
  document.querySelectorAll('[style^="position: fixed"][style*="bottom: 1rem"][style*="z-index: 2147483647"]').forEach(el => el.remove());
};

// Executa a função imediatamente ao carregar
removeFloating();

// Observa mudanças no DOM e reaplica a função se novos elementos forem adicionados
const observer = new MutationObserver(removeFloating);
observer.observe(document.body, { childList: true, subtree: true }); 

const services = [
  { icon: Monitor, key: '01', title: 'Desenvolvimento Web', text: 'Sites institucionais, plataformas web e aplicações modernas.' },
  { icon: Layers3, key: '02', title: 'Sistemas Empresariais', text: 'Sistemas personalizados para automatizar processos e melhorar a gestão.' },
  { icon: Smartphone, key: '03', title: 'Aplicativos', text: 'Aplicativos modernos para Android, iOS e soluções multiplataforma.' },
  { icon: Rocket, key: '04', title: 'SaaS', text: 'Desenvolvimento de plataformas SaaS escaláveis e preparadas para crescimento.' },
  { icon: Network, key: '05', title: 'APIs e Integrações', text: 'APIs robustas e integrações entre sistemas e serviços.' },
  { icon: Bot, key: '06', title: 'Automação', text: 'Automação de processos para reduzir tarefas manuais e aumentar produtividade.' },
];
const processSteps = [
  ['01', 'Descoberta', 'Entendemos sua necessidade, objetivos e público.'], ['02', 'Planejamento', 'Definimos arquitetura, funcionalidades e estratégia.'], ['03', 'Desenvolvimento', 'Construímos a solução utilizando tecnologias modernas.'], ['04', 'Testes', 'Validamos segurança, performance e experiência.'], ['05', 'Entrega', 'Publicamos e entregamos a solução pronta para utilização.'], ['06', 'Evolução', 'Continuamos evoluindo o produto conforme as necessidades do negócio.'],
];
const technologies = ['React', 'Next.js', 'Node.js', 'TypeScript', 'Go', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Git', 'Linux'];

export type PortfolioProject = {
  id: string;
  vercel_project_name: string;
  display_name: string;
  description: string;
  category: string;
  url: string;
  sort_order: number;
  state: string;
  target: string;
  updatedAt: string | null;
};

const categoryIcons: Record<string, { icon: typeof Globe2; gradient: string }> = {
  Web: { icon: Globe2, gradient: 'blue' },
  SaaS: { icon: Layers3, gradient: 'violet' },
  Sistemas: { icon: Database, gradient: 'cyan' },
  Aplicativos: { icon: Smartphone, gradient: 'blue' },
};

function usePortfolioProjects() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/portfolio-projects`;
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`Falha ao carregar projetos (${res.status})`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setProjects(json.projects ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  return { projects, loading, error, refetch: fetchProjects };
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <a className={`logo ${compact ? 'logo-compact' : ''}`} href="/" aria-label="Altixdev, início"><span className="logo-mark">A</span><span className="logo-word">alti<span>x</span>dev</span></a>;
}

function App() {
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem('altix-locale') as Locale) || 'pt-BR');
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(() => !localStorage.getItem('altix-cookies'));
  const [cookieSettings, setCookieSettings] = useState(false);
  const [path, setPath] = useState(window.location.pathname);
  const t = translations[locale];
  const pageTitle = useMemo(() => ({ '/servicos': t.servicesTitle, '/solucoes': t.solutions, '/portfolio': t.portfolioTitle, '/sobre': t.aboutTitle, '/contato': t.contactTitle }[path] || 'Altixdev — Desenvolvimento de Software e Soluções Digitais'), [path, t]);

  useEffect(() => { localStorage.setItem('altix-locale', locale); document.documentElement.lang = locale; document.title = pageTitle; }, [locale, pageTitle]);
  useEffect(() => { const onPop = () => setPath(window.location.pathname); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  const go = (href: string) => { setMenuOpen(false); if (href.startsWith('#')) { document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); return; } window.history.pushState({}, '', href); setPath(href); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const acceptCookies = (value: string) => { localStorage.setItem('altix-cookies', value); setCookieOpen(false); setCookieSettings(false); };

  return <div className="app-shell">
    <header className="site-header"><div className="header-inner"><Logo />
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
        {[['/', t.home], ['#solucoes', t.solutions], ['#servicos', t.services], ['#processo', t.process], ['#sobre', t.about], ['/contato', t.contact]].map(([href, label]) => <button key={href} onClick={() => go(href)} className={path === href ? 'active' : ''}>{label}</button>)}
      </nav>
      <div className="header-actions"><div className="language"><button className="language-trigger" onClick={() => setLanguageOpen(!languageOpen)} aria-expanded={languageOpen}><Globe2 size={16} /> <span>{locale === 'pt-BR' ? 'PT-BR' : locale.toUpperCase()}</span><ChevronDown size={14} /></button>{languageOpen && <div className="language-menu">{Object.entries(localeNames).map(([key, name]) => <button key={key} onClick={() => { setLocale(key as Locale); setLanguageOpen(false); }}>{name}{locale === key && <Check size={14} />}</button>)}</div>}</div><button className="button button-small" onClick={() => go('/contato')}>{t.quote}<ArrowUpRight size={16} /></button></div>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>{menuOpen ? <X /> : <Menu />}</button>
    </div></header>
    <main>{path === '/contato' ? <ContactPage t={t} /> : path === '/portfolio' ? <PortfolioPage t={t} go={go} /> : path === '/politica-de-privacidade' || path === '/politica-de-cookies' || path === '/termos-de-uso' ? <PolicyPage path={path} /> : <Home t={t} go={go} path={path} />}</main>
    <Footer t={t} go={go} />
    {cookieOpen && <CookieBanner t={t} settings={cookieSettings} setSettings={setCookieSettings} accept={acceptCookies} />}
    <a className="whatsapp" href="https://wa.me/5591992261383" target="_blank" rel="noreferrer" aria-label="Fale conosco pelo WhatsApp"><MessageCircle size={21} /><span>Fale conosco</span></a>
  </div>;
}

function Home({ t, go, path }: { t: Record<string, string>; go: (href: string) => void; path: string }) {
  return <>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" />{t.eyebrow}</div><h1>{t.heroTitle}</h1><p>{t.heroText}</p><div className="hero-actions"><button className="button" onClick={() => go('/contato')}>{t.quote}<ArrowRight size={17} /></button><button className="text-button" onClick={() => go('#solucoes')}>{t.explore}<ArrowRight size={17} /></button></div><div className="hero-proof"><span className="proof-line" /><span>Engenharia digital com propósito</span></div></div><HeroVisual /></div><div className="hero-fade" /></section>
    <div className="signal-strip"><div className="container signal-inner"><span>Software sob medida</span><span>Arquitetura escalável</span><span>Produto digital</span><span>Performance & segurança</span></div></div>
    <section id="solucoes" className="section solutions-section"><div className="container"><SectionHeading kicker="O que fazemos" title={t.servicesTitle} text={t.servicesText} /><div className="service-grid">{services.map((service) => <article className="service-card" key={service.key}><div className="service-top"><span className="service-index">{service.key}</span><div className="icon-box"><service.icon size={22} /></div></div><h3>{service.title}</h3><p>{service.text}</p><span className="card-arrow"><ArrowUpRight size={17} /></span></article>)}</div></div></section>
    <section className="section why-section"><div className="container why-grid"><div><SectionHeading kicker="Por que a Altixdev" title={t.whyTitle} text="Unimos visão de produto, engenharia e design para criar tecnologia que faz sentido para o seu negócio." /><div className="feature-list">{['Desenvolvimento sob medida', 'Arquitetura moderna', 'Código organizado', 'Segurança', 'Escalabilidade', 'Performance'].map((item) => <span key={item}><Check size={15} />{item}</span>)}</div></div><div className="systems-card"><div className="systems-header"><span>ALTIX / SYSTEMS</span><span className="live-dot">● online</span></div><div className="systems-graphic"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="core"><span>A</span></div><div className="node node-one"><Code2 size={15} /></div><div className="node node-two"><ShieldCheck size={15} /></div><div className="node node-three"><Zap size={15} /></div></div><div className="systems-footer"><span><b>24/7</b><small>visão de produto</small></span><span><b>∞</b><small>possibilidades</small></span><span><b>01</b><small>parceiro técnico</small></span></div></div></div></section>
    <section id="processo" className="section process-section"><div className="container"><SectionHeading kicker="Como trabalhamos" title={t.processTitle} text="Um processo claro, colaborativo e orientado a resultados em cada etapa." centered /><div className="process-grid">{processSteps.map(([number, title, text], i) => <div className="process-step" key={number}><div className="process-number">{number}</div><div className="process-line">{i < processSteps.length - 1 && <span />}</div><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
    <section className="section tech-section"><div className="container tech-layout"><div><SectionHeading kicker="Nosso stack" title={t.techTitle} text="Escolhemos as ferramentas certas para cada desafio, combinando robustez, velocidade e flexibilidade." /></div><div className="tech-cloud">{technologies.map((tech, i) => <span className={`tech-pill tech-${i % 4}`} key={tech}>{tech}</span>)}</div></div></section>
    <section id="portfolio" className="section portfolio-section"><div className="container"><SectionHeading kicker="Portfólio" title={t.portfolioTitle} text="Projetos reais, construídos e publicados. Cada solução é desenvolvida sob medida para o seu propósito." /><PortfolioPreview t={t} go={go} /></div></section>
    <section id="sobre" className="section about-section"><div className="container about-grid"><div className="about-visual"><div className="about-logo"><img src="/images/image.png" alt="Símbolo Altixdev" /></div><span className="about-orbit orbit-a" /><span className="about-orbit orbit-b" /></div><div><SectionHeading kicker="Sobre a Altixdev" title={t.aboutTitle} text="A Altixdev nasceu com o propósito de transformar ideias e necessidades de negócio em soluções digitais modernas, eficientes e escaláveis." /><div className="values">{['Inovação', 'Transparência', 'Qualidade', 'Segurança', 'Performance'].map((value, i) => <span key={value}><b>0{i + 1}</b>{value}</span>)}</div></div></div></section>
    <section className="cta-section"><div className="container cta-inner"><div><span className="eyebrow"><span className="eyebrow-dot" />Pronto para começar?</span><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div><button className="button button-light" onClick={() => go('/contato')}>{t.quote}<ArrowUpRight size={17} /></button></div></section>
  </>;
}

function HeroVisual() { return <div className="hero-visual"><div className="visual-label label-one"><span>ALTIX / 01</span><small>digital craft</small></div><div className="visual-label label-two"><span>∞</span><small>build better</small></div><div className="visual-frame"><div className="frame-lines" /><div className="hero-a"><span>A</span></div><div className="hero-ring ring-one" /><div className="hero-ring ring-two" /><span className="spark spark-one" /><span className="spark spark-two" /><span className="spark spark-three" /></div><div className="visual-caption"><span>IDEA</span><span className="caption-line" /><span>IMPACT</span></div></div>; }
function SectionHeading({ kicker, title, text, centered = false }: { kicker: string; title: string; text: string; centered?: boolean }) { return <div className={`section-heading ${centered ? 'centered' : ''}`}><span className="section-kicker">{kicker}</span><h2>{title}</h2><p>{text}</p></div>; }

function ContactPage({ t }: { t: Record<string, string> }) { const [sent, setSent] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setError(''); const form = event.currentTarget; if (!form.checkValidity()) { setError('Confira os campos obrigatórios antes de enviar.'); return; } setLoading(true); window.setTimeout(() => { setLoading(false); setSent(true); form.reset(); }, 800); }; return <section className="contact-page section"><div className="container contact-grid"><div className="contact-intro"><span className="section-kicker">Contato</span><h1>{t.contactTitle}</h1><p>Conte um pouco sobre o que você quer construir. Nós cuidamos de transformar a ideia em um próximo passo claro.</p><div className="contact-points"><span><MailIcon /><b>Resposta em até 2 dias úteis</b></span><span><ShieldCheck /><b>Seus dados tratados com cuidado</b></span><span><Sparkles /><b>Primeira conversa sem compromisso</b></span></div></div><form className="contact-form" onSubmit={submit} noValidate>{sent ? <div className="form-success"><span><Check size={25} /></span><h2>{t.success}</h2><p>Obrigado por confiar na Altixdev.</p><button type="button" className="text-button" onClick={() => setSent(false)}>Enviar outra solicitação <ArrowRight size={16} /></button></div> : <><div className="form-heading"><span>Fale com nosso time</span><small>Campos marcados com * são obrigatórios.</small></div><div className="form-row"><Field label={`${t.name} *`} name="name" required /><Field label={t.company} name="company" /></div><div className="form-row"><Field label={`${t.email} *`} name="email" type="email" required /><Field label={t.phone} name="phone" type="tel" /></div><div className="form-row"><SelectField label={t.project} options={['Site', 'Sistema', 'Aplicativo', 'SaaS', 'API', 'Automação', 'Outro']} /><SelectField label={t.budget} options={['Até R$ 10 mil', 'R$ 10 mil – R$ 30 mil', 'R$ 30 mil – R$ 60 mil', 'A definir']} /></div><label className="field-label">{t.message} *<textarea name="message" rows={5} required placeholder="Como podemos ajudar?" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button form-submit" type="submit" disabled={loading}>{loading ? 'Enviando...' : t.send}<Send size={17} /></button><p className="form-note"><LockKeyhole size={14} /> Seus dados não serão usados para spam.</p></>}</form></div></section>; }
function MailIcon() { return <span className="point-icon"><Send size={16} /></span>; }
function Field({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) { return <label className="field-label">{label}<input name={name} type={type} required={required} /></label>; }
function SelectField({ label, options }: { label: string; options: string[] }) { return <label className="field-label">{label}<select defaultValue=""><option value="" disabled>Selecione</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }

function PortfolioPreview({ t, go }: { t: Record<string, string>; go: (href: string) => void }) {
  const { projects, loading } = usePortfolioProjects();
  if (loading) return <div className="project-grid"><div className="project-skeleton" /><div className="project-skeleton" /></div>;
  const shown = projects.slice(0, 4);
  return <><div className="filter-row"><button className="filter active">Todos</button><button className="filter">Web</button><button className="filter">SaaS</button><button className="filter">Sistemas</button><button className="filter">Aplicativos</button><button className="view-all" onClick={() => go('/portfolio')}>Ver portfólio completo <ArrowRight size={16} /></button></div><div className="project-grid">{shown.map((project) => { const cat = categoryIcons[project.category] ?? categoryIcons.Web; const Icon = cat.icon; return <a className={`project-card ${cat.gradient}`} key={project.id} href={project.target} target="_blank" rel="noreferrer"><div className="project-art"><Icon size={34} /><span className="art-grid" />{project.state === 'READY' && <span className="live-badge"><i />Live</span>}</div><div className="project-content"><span>{project.category}</span><h3>{project.display_name}</h3><p className="project-desc">{project.description}</p><ArrowUpRight size={18} /></div></a>; })}</div></>;
}

function PortfolioPage({ t, go }: { t: Record<string, string>; go: (href: string) => void }) {
  const { projects, loading, error, refetch } = usePortfolioProjects();
  const [filter, setFilter] = useState('Todos');
  const filters = ['Todos', 'Web', 'SaaS', 'Sistemas', 'Aplicativos'];
  const filtered = filter === 'Todos' ? projects : projects.filter((p) => p.category === filter);
  return <section className="portfolio-page section"><div className="container"><div className="portfolio-header"><span className="section-kicker">Portfólio</span><h1>{t.portfolioTitle}</h1><p>Projetos reais, publicados e atualizados automaticamente. Quando um projeto é atualizado na Vercel, o portfólio reflete a versão mais recente em tempo real.</p></div><div className="filter-row filter-row-page"><div className="filter-group">{filters.map((f) => <button key={f} className={`filter ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}</div><button className="view-all" onClick={refetch}>Atualizar <ArrowRight size={16} /></button></div>{loading ? <div className="project-grid project-grid-page">{Array.from({ length: 4 }).map((_, i) => <div className="project-skeleton" key={i} />)}</div> : error ? <div className="portfolio-error"><p>Não foi possível carregar os projetos agora.</p><button className="text-button" onClick={refetch}>Tentar novamente <ArrowRight size={16} /></button></div> : filtered.length === 0 ? <div className="portfolio-empty"><p>Nenhum projeto nesta categoria ainda.</p></div> : <div className="project-grid project-grid-page">{filtered.map((project) => { const cat = categoryIcons[project.category] ?? categoryIcons.Web; const Icon = cat.icon; return <a className={`project-card ${cat.gradient}`} key={project.id} href={project.target} target="_blank" rel="noreferrer"><div className="project-art"><Icon size={34} /><span className="art-grid" />{project.state === 'READY' && <span className="live-badge"><i />Live</span>}</div><div className="project-content"><span>{project.category}</span><h3>{project.display_name}</h3><p className="project-desc">{project.description}</p><div className="project-meta"><span className={`state-pill ${project.state === 'READY' ? 'state-ready' : 'state-other'}`}>{project.state === 'READY' ? 'Online' : project.state}</span><span className="project-url">{new URL(project.target).hostname}</span></div><ArrowUpRight size={18} /></div></a>; })}</div>}</div></section>;
}

function PolicyPage({ path }: { path: string }) { const title = path === '/politica-de-privacidade' ? 'Política de privacidade' : path === '/politica-de-cookies' ? 'Política de cookies' : 'Termos de uso'; return <section className="policy-page section"><div className="narrow"><span className="section-kicker">Altixdev</span><h1>{title}</h1><p className="policy-lead">Informações importantes sobre a sua relação com a Altixdev.</p>{['Visão geral', 'Como usamos as informações', 'Segurança e transparência', 'Seus direitos', 'Atualizações'].map((heading, i) => <div className="policy-block" key={heading}><h2>{`0${i + 1}`} {heading}</h2><p>Este conteúdo será atualizado com as informações específicas da Altixdev e com a legislação aplicável. Nosso compromisso é comunicar de forma clara, respeitar sua privacidade e manter uma relação transparente em cada interação.</p></div>)}</div></section>; }
function Footer({ t, go }: { t: Record<string, string>; go: (href: string) => void }) { return <footer className="site-footer"><div className="footer-glow" /><div className="container"><div className="footer-main"><div className="footer-brand"><Logo /><p>Transformamos ideias<br />em tecnologia.</p><span className="footer-status"><i /> Disponível para novos projetos</span><div className="footer-socials"><a href="https://www.linkedin.com/company/altixdev/?viewAsMember=true" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a><a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /></a><a href="https://www.instagram.com/altixdev/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a></div></div><div className="footer-links"><div><span>Empresa</span><button onClick={() => go('#sobre')}>{t.about}</button><button onClick={() => go('/portfolio')}>{t.portfolioTitle}</button><button onClick={() => go('/contato')}>{t.contact}</button></div><div><span>Especialidades</span><button onClick={() => go('#servicos')}>Desenvolvimento web</button><button onClick={() => go('#servicos')}>Sistemas e SaaS</button><button onClick={() => go('#servicos')}>Aplicativos</button></div><div><span>Legal</span><button onClick={() => go('/politica-de-privacidade')}>Privacidade</button><button onClick={() => go('/politica-de-cookies')}>Cookies</button><button onClick={() => go('/termos-de-uso')}>Termos de uso</button></div></div><div className="footer-contact"><span>Vamos construir algo relevante?</span><a href="mailto:contato@altixdev.com">contato@altixdev.com <ArrowUpRight size={14} /></a><button onClick={() => go('/contato')}>Iniciar uma conversa <ArrowRight size={15} /></button></div></div><div className="footer-signature"><span className="signature-line" /><span>ALTIXDEV / DIGITAL ENGINEERING</span><span className="signature-line" /></div><div className="footer-bottom"><span>© 2026 Altixdev. Todos os direitos reservados.</span><button onClick={() => { localStorage.removeItem('altix-cookies'); window.location.reload(); }}>Preferências de cookies</button><span>Feito para construir o que vem depois.</span></div></div></footer>; }
function CookieBanner({ t, settings, setSettings, accept }: { t: Record<string, string>; settings: boolean; setSettings: (value: boolean) => void; accept: (value: string) => void }) { return <div className={`cookie-wrap ${settings ? 'expanded' : ''}`}><div className="cookie-banner"><div className="cookie-copy"><span className="cookie-icon"><Globe2 size={18} /></span><div><h3>{t.cookies}</h3><p>{t.cookiesText}</p></div></div>{settings ? <div className="cookie-options"><label><span><b>Necessários</b><small>Sempre ativos</small></span><input type="checkbox" checked readOnly /></label><label><span><b>Preferências</b><small>Personalização</small></span><input type="checkbox" /></label><label><span><b>Analytics</b><small>Métricas anônimas</small></span><input type="checkbox" /></label></div> : null}<div className="cookie-actions"><button className="cookie-secondary" onClick={() => accept('necessary')}>{t.reject}</button><button className="cookie-secondary" onClick={() => setSettings(!settings)}>{settings ? 'Salvar preferências' : t.configure}</button><button className="button button-small" onClick={() => accept('all')}>{t.accept}</button></div></div></div>; }
export default App;
