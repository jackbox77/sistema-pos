import { useState, useEffect } from 'react'
import PageModule from '../../components/PageModule/PageModule'
import { getBucketUseCase } from '../../feature/storage/use-case'
import { Folder, Image as ImageIcon, Loader2, Link as LinkIcon, Download, Copy } from 'lucide-react'
import './Imagenes.css'

export default function Imagenes() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [bucketData, setBucketData] = useState(null)
    const [currentPath, setCurrentPath] = useState([]) // array of folder names
    const [copiedUrl, setCopiedUrl] = useState('')

    useEffect(() => {
        loadBucket()
    }, [])

    const loadBucket = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await getBucketUseCase()
            setBucketData(res.data)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Error al cargar las imágenes')
        } finally {
            setLoading(false)
        }
    }

    const handleCopyUrl = (url) => {
        navigator.clipboard.writeText(url)
        setCopiedUrl(url)
        setTimeout(() => setCopiedUrl(''), 2000)
    }

    // Helper para navegar el árbol
    const getCurrentDirectoryNode = () => {
        if (!bucketData || !bucketData.tree || !bucketData.tree.folders) {
            return { folders: {}, images: [] }
        }

        let current = bucketData.tree
        for (const folder of currentPath) {
            if (current.folders && current.folders[folder]) {
                current = current.folders[folder]
            } else {
                return { folders: {}, images: [] }
            }
        }
        return current
    }

    const navigateToFolder = (folderName) => {
        setCurrentPath(prev => [...prev, folderName])
    }

    const navigateUp = (index) => {
        setCurrentPath(prev => prev.slice(0, index + 1))
    }

    const navigateRoot = () => {
        setCurrentPath([])
    }

    if (loading) {
        return (
            <PageModule title="Imágenes almacenadas" description="Explora la galería de imágenes de tu negocio" fullWidth>
                <div className="imagenes-loading">
                    <Loader2 className="spinner" size={40} />
                    <p>Cargando almacenamiento...</p>
                </div>
            </PageModule>
        )
    }

    if (error) {
        return (
            <PageModule title="Imágenes almacenadas" description="Explora la galería de imágenes de tu negocio" fullWidth>
                <div className="imagenes-error">
                    <p>{error}</p>
                    <button onClick={loadBucket} className="btn-primary">Reintentar</button>
                </div>
            </PageModule>
        )
    }

    const currentDirNode = getCurrentDirectoryNode()
    const folders = Object.keys(currentDirNode.folders || {})
    const images = currentDirNode.images || []

    return (
        <PageModule title="Imágenes almacenadas" description="Explora y visualiza todas las imágenes guardadas en tu cuenta" fullWidth>
            <div className="imagenes-container">

                {/* Breadcrumb Navigation */}
                <div className="imagenes-breadcrumb">
                    <button onClick={navigateRoot} className={`breadcrumb-btn ${currentPath.length === 0 ? 'active' : ''}`}>
                        Raíz
                    </button>
                    {currentPath.map((folder, idx) => (
                        <span key={idx} className="breadcrumb-item">
                            <span className="breadcrumb-separator">/</span>
                            <button
                                onClick={() => navigateUp(idx)}
                                className={`breadcrumb-btn ${idx === currentPath.length - 1 ? 'active' : ''}`}
                            >
                                {folder}
                            </button>
                        </span>
                    ))}
                </div>

                {/* Browser Area */}
                <div className="imagenes-grid-area">
                    {folders.length === 0 && images.length === 0 && (
                        <div className="imagenes-empty">
                            <ImageIcon size={48} className="empty-icon" />
                            <p>Esta carpeta está vacía</p>
                        </div>
                    )}

                    {/* Folders Section */}
                    {folders.length > 0 && (
                        <div className="imagenes-section">
                            <h3 className="section-title">Carpetas</h3>
                            <div className="folders-grid">
                                {folders.map(folderName => (
                                    <button key={folderName} className="folder-card" onClick={() => navigateToFolder(folderName)}>
                                        <Folder className="folder-icon" />
                                        <span className="folder-name">{folderName}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Images Section */}
                    {images.length > 0 && (
                        <div className="imagenes-section">
                            <h3 className="section-title">Archivos de imagen</h3>
                            <div className="files-grid">
                                {images.map((img, idx) => (
                                    <div key={idx} className="file-card">
                                        <div className="file-card-preview-wrap">
                                            <img src={img.url} alt={img.key} className="file-card-preview" loading="lazy" />
                                        </div>
                                        <div className="file-card-info">
                                            <span className="file-card-name" title={img.key}>{img.key.split('/').pop()}</span>
                                            <div className="file-card-actions">
                                                <button
                                                    onClick={() => handleCopyUrl(img.url)}
                                                    className="file-card-action-btn"
                                                    title="Copiar link"
                                                >
                                                    {copiedUrl === img.url ? <span style={{ fontSize: 12, color: '#0d9488', fontWeight: 600 }}>¡Copiado!</span> : <Copy size={16} />}
                                                </button>
                                                <a
                                                    href={img.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="file-card-action-btn"
                                                    title="Abrir imagen"
                                                >
                                                    <LinkIcon size={16} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </PageModule>
    )
}
