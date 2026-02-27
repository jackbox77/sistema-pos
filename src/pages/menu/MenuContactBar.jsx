import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react'
import './MenuContactBar.css'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

function getTodayScheduleLabel(schedule) {
    if (!schedule?.length) return null
    // JS: 0=Dom,1=Lun...6=Sab → nuestro sistema: 0=Lun...6=Dom
    const jsDay = new Date().getDay()
    const customDay = jsDay === 0 ? 6 : jsDay - 1
    const dayData = schedule.find(s => s.day === customDay)
    if (!dayData || !dayData.slots?.length) return { day: DAYS[customDay], closed: true }
    return {
        day: DAYS[customDay],
        closed: false,
        slots: dayData.slots.map(s => `${s.from} – ${s.to}`).join(', ')
    }
}

export default function MenuContactBar({ empresaInfo, apariencia }) {
    const {
        whatsapp_contact, visibility_whatsapp_contact,
        mail_contact, visibility_mail_contact,
        phone_contact, visibility_phone_contact,
        location, visibility_location,
        schedule, schedule_visibility,
    } = empresaInfo || {}

    const { colorTitulo = '#134e4a', colorContenido = '#ffffff', colorTexto = '#1f2937' } = apariencia || {}

    const showWhatsapp = visibility_whatsapp_contact && whatsapp_contact?.trim()
    const showMail = visibility_mail_contact && mail_contact?.trim()
    const showPhone = visibility_phone_contact && phone_contact?.trim()
    const showLocation = visibility_location && location?.trim()
    const showSchedule = schedule_visibility && schedule?.some(d => d.slots?.length > 0)

    const hasAny = showWhatsapp || showMail || showPhone || showLocation || showSchedule
    if (!hasAny) return null

    const scheduleInfo = showSchedule ? getTodayScheduleLabel(schedule) : null
    const numeroWA = whatsapp_contact?.replace(/\D/g, '')

    // Usamos el colorTitulo como fondo de la barra (verde oscuro por defecto)
    const barBg = colorTitulo
    const barColor = colorContenido

    return (
        <div className="mcb-bar" style={{ background: barBg, color: barColor }}>
            {showLocation && (
                <div className="mcb-item">
                    <MapPin size={16} className="mcb-icon" />
                    <span>{location}</span>
                </div>
            )}

            {showPhone && (
                <a
                    href={`tel:${phone_contact.replace(/\D/g, '')}`}
                    className="mcb-item mcb-link"
                    style={{ color: barColor }}
                >
                    <Phone size={16} className="mcb-icon" />
                    <span>{phone_contact}</span>
                </a>
            )}

            {showMail && (
                <a
                    href={`mailto:${mail_contact}`}
                    className="mcb-item mcb-link"
                    style={{ color: barColor }}
                >
                    <Mail size={16} className="mcb-icon" />
                    <span>{mail_contact}</span>
                </a>
            )}

            {showWhatsapp && (
                <a
                    href={`https://wa.me/${numeroWA}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mcb-item mcb-link"
                    style={{ color: barColor }}
                >
                    <MessageCircle size={16} className="mcb-icon" />
                    <span>{whatsapp_contact}</span>
                </a>
            )}

            {showSchedule && scheduleInfo && (
                <div className="mcb-item">
                    <Clock size={16} className="mcb-icon" />
                    {scheduleInfo.closed ? (
                        <span>
                            <strong>{scheduleInfo.day}:</strong>{' '}
                            <span className="mcb-closed">Cerrado</span>
                        </span>
                    ) : (
                        <span>
                            <strong>{scheduleInfo.day}:</strong> {scheduleInfo.slots}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
