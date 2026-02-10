import './PageModule.css'

export default function PageModule({ title, description, children }) {
  return (
    <div className="page-module">
      <h1>{title}</h1>
      {description && <p className="page-module-desc">{description}</p>}
      {children}
    </div>
  )
}
