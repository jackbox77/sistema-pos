import './PageModule.css'

export default function PageModule({ title, description, fullWidth, children }) {
  return (
    <div className={`page-module${fullWidth ? ' page-module--full-width' : ''}`}>
      <h1>{title}</h1>
      {description && <p className="page-module-desc">{description}</p>}
      {children}
    </div>
  )
}
