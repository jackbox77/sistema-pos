import PageModule from '../../components/PageModule/PageModule'

export default function Subscripciones() {
  return (
    <PageModule
      title="Subscripciones"
      description="Administra tu plan y nivel de suscripción del sistema."
    >
      <div className="subscription-card">
        <h3>Plan actual</h3>
        <p className="subscription-plan">Plan gratuito</p>
        <p className="subscription-desc">Características básicas del sistema POS.</p>
        <div className="subscription-features">
          <span>✓ Hasta 100 facturas/mes</span>
          <span>✓ 1 usuario</span>
          <span>✓ Soporte por email</span>
        </div>
        <button className="btn-primary" style={{ marginTop: '16px' }}>
          Ver planes disponibles
        </button>
      </div>
    </PageModule>
  )
}
