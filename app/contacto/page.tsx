"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/shared/Header"
import Footer from "@/components/shared/Footer"
import { CheckCircle, Upload, MessageCircle, Phone, Mail, AlertCircle } from "lucide-react"

// Component to handle search params
function ProductSelector({ onProductSelect }: { onProductSelect: (product: string | null) => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const producto = searchParams.get('producto')
    const formato = searchParams.get('formato')
    
    if (producto) {
      const productInfo = formato ? `${producto} - ${formato}` : producto
      onProductSelect(productInfo)
    }
  }, [searchParams, onProductSelect])

  return null
}

function ContactPageContent() {
  // ===== CONFIGURACIÓN DEL ENDPOINT PHP =====
  const PHP_ENDPOINT = "https://www.decorcolombiatiles.com/api/enviar-cotizacion.php"

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  // Agregar estado para drag and drop
  const [isDragOver, setIsDragOver] = useState(false)

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    empresa: "",
    telefono: "",
    email: "",
    ciudad: "",
    tipoProyecto: "",
    tipoCotizacion: "",
    descripcion: "",
    archivo: null as File | null
  })

  const [formStatus, setFormStatus] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Función para validar archivos
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const maxSize = 25 * 1024 * 1024 // 25 MB en bytes
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'El archivo excede el tamaño máximo de 25 MB' }
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Tipo de archivo no permitido. Solo PDF, JPG y PNG' }
    }
    
    return { isValid: true }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
    if (file) {
      const validation = validateFile(file)
      if (validation.isValid) {
        setFormData(prev => ({ ...prev, archivo: file }))
        setFormStatus(prev => ({ ...prev, message: "", isError: false }))
      } else {
        setFormStatus({
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: validation.error || 'Error con el archivo'
        })
        // Limpiar el input
        e.target.value = ''
      }
    } else {
      setFormData(prev => ({ ...prev, archivo: null }))
    }
  }

  // Funciones para drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const validation = validateFile(file)
      
      if (validation.isValid) {
        setFormData(prev => ({ ...prev, archivo: file }))
        setFormStatus(prev => ({ ...prev, message: "", isError: false }))
      } else {
        setFormStatus({
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: validation.error || 'Error con el archivo'
        })
      }
    }
  }

  // Función para eliminar archivo seleccionado
  const removeFile = () => {
    setFormData(prev => ({ ...prev, archivo: null }))
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  // Función para obtener preview del archivo
  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file)
    }
    return null
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, tipoCotizacion: e.target.value }))
  }

  const resetFormStatus = () => {
    setTimeout(() => {
      setFormStatus({
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: ""
      })
    }, 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setFormStatus({
      isLoading: true,
      isSuccess: false,
      isError: false,
      message: "Enviando solicitud..."
    })

    try {
      // Preparar FormData para envío PHP
      const formDataToSend = new FormData()
      formDataToSend.append('fullName', formData.nombreCompleto)
      formDataToSend.append('companyName', formData.empresa)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.telefono)
      formDataToSend.append('city', formData.ciudad)
      formDataToSend.append('projectType', formData.tipoProyecto)
      formDataToSend.append('quotationType', formData.tipoCotizacion)
      formDataToSend.append('description', formData.descripcion)
      
      // Agregar archivo si existe
      if (formData.archivo) {
        formDataToSend.append('file', formData.archivo)
      }

      // Agregar producto específico si viene desde el catálogo
      if (selectedProduct) {
        formDataToSend.append('productName', selectedProduct)
      }

      // Enviar al endpoint PHP
      const response = await fetch(PHP_ENDPOINT, {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Error en el servidor')
      }

      // Email enviado
      
      setFormStatus({
        isLoading: false,
        isSuccess: true,
        isError: false,
        message: "¡Solicitud enviada exitosamente! Te contactaremos pronto."
      })

      // Limpiar formulario
      setFormData({
        nombreCompleto: "",
        empresa: "",
        telefono: "",
        email: "",
        ciudad: "",
        tipoProyecto: "",
        tipoCotizacion: "",
        descripcion: "",
        archivo: null
      })

      // Limpiar input de archivo
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      resetFormStatus()

    } catch {
      // Error al enviar email
      setFormStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: "Error al enviar la solicitud. Por favor, intenta nuevamente."
      })
      resetFormStatus()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Wrap ProductSelector in its own Suspense boundary */}
      <Suspense fallback={null}>
        <ProductSelector onProductSelect={setSelectedProduct} />
      </Suspense>

      {/* Hero Section */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-[var(--silver-blue-50)] via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Contacta con
              <span className="silver-blue-text-gradient">
                {" "}
                Nuestros Expertos
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos aquí para asesorarte en tu proyecto. Completa el formulario y nos pondremos en contacto contigo
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Información de Contacto */}
          <div className="lg:col-span-1">
            <Card className="h-fit sticky top-24">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>
                
                {/* WhatsApp */}
                <div className="flex items-start space-x-4 mb-6 p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                    <p className="text-gray-600">+57 312 801 9770</p>
                    <p className="text-sm text-green-600">Atención inmediata</p>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="flex items-start space-x-4 mb-6 p-4 bg-[var(--silver-blue-50)] rounded-lg">
                  <div className="w-12 h-12 bg-[var(--silver-blue-600)] rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Teléfono</h3>
                    <p className="text-gray-600">+57 312 801 9770</p>
                    <p className="text-sm text-[var(--silver-blue-600)]">Lun - Vie: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 mb-6 p-4 bg-[var(--silver-blue-50)] rounded-lg">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-00">Email</h3>
                    <p className="text-sm text-gray-600">contacto@decorcolombiatiles.com</p>
                    <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
                  </div>
                </div>

                {/* ¿Por qué elegirnos? */}
                <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">¿Por qué elegirnos?</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Más de 13 años de experiencia
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Productos importados de calidad Premium
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Instalación profesional certificada
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Garantía integral en nuestros acabados
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Acompañamiento técnico especializado
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de Cotización */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Formulario de Cotización</h2>
                
                {/* Producto seleccionado */}
                {selectedProduct && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-blue-900">Producto Seleccionado</h3>
                        <p className="text-blue-700">{selectedProduct}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Estado del formulario */}
                {formStatus.message && (
                  <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                    formStatus.isSuccess ? 'bg-green-50 text-green-800' :
                    formStatus.isError ? 'bg-red-50 text-red-800' :
                    'bg-blue-50 text-blue-800'
                  }`}>
                    {formStatus.isSuccess && <CheckCircle className="w-5 h-5" />}
                    {formStatus.isError && <AlertCircle className="w-5 h-5" />}
                    {formStatus.isLoading && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    )}
                    <span>{formStatus.message}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre completo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre completo *
                      </label>
                      <Input
                        type="text"
                        placeholder="Tu nombre completo"
                        value={formData.nombreCompleto}
                        onChange={(e) => handleInputChange("nombreCompleto", e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Empresa */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Empresa / Organización
                      </label>
                      <Input
                        type="text"
                        placeholder="Nombre de la empresa"
                        value={formData.empresa}
                        onChange={(e) => handleInputChange("empresa", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Número de celular */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de celular / WhatsApp *
                      </label>
                      <Input
                        type="tel"
                        placeholder="+57 300 123 4567"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Correo electrónico */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo electrónico *
                      </label>
                      <Input
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ciudad / Ubicación del proyecto */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad / Ubicación del proyecto
                      </label>
                      <Input
                        type="text"
                        placeholder="Bogotá, Medellín, Cali..."
                        value={formData.ciudad}
                        onChange={(e) => handleInputChange("ciudad", e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Tipo de proyecto */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de proyecto *
                      </label>
                      <Select onValueChange={(value) => handleInputChange("tipoProyecto", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residencial">Residencial</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* ¿Qué deseas cotizar? */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Qué deseas cotizar?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="cotizar" 
                          value="producto" 
                          className="mr-2" 
                          onChange={handleRadioChange}
                          checked={formData.tipoCotizacion === "producto"}
                        />
                        <span className="text-sm">Sólo producto</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="cotizar" 
                          value="instalacion" 
                          className="mr-2" 
                          onChange={handleRadioChange}
                          checked={formData.tipoCotizacion === "instalacion"}
                        />
                        <span className="text-sm">Instalación</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="cotizar" 
                          value="integral" 
                          className="mr-2" 
                          onChange={handleRadioChange}
                          checked={formData.tipoCotizacion === "integral"}
                        />
                        <span className="text-sm">Integral</span>
                      </label>
                    </div>
                  </div>

                  {/* Descripción breve del proyecto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción breve del proyecto *
                    </label>
                    <Textarea
                      placeholder="Cuéntanos sobre el proyecto, especifica áreas, estilo, medidas, entre otros aspectos técnicos."
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange("descripcion", e.target.value)}
                      required
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  {/* Adjuntar archivo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adjunta archivo (PDF, JPG, PNG)
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isDragOver 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {formData.archivo ? (
                        // Mostrar archivo seleccionado
                        <div className="space-y-4">
                          {getFilePreview(formData.archivo) && (
                            <div className="mb-4">
                              <Image 
                                src={getFilePreview(formData.archivo)!} 
                                alt="Vista previa" 
                                width={300}
                                height={128}
                                className="max-w-full h-32 object-contain mx-auto rounded"
                                unoptimized={true}
                              />
                            </div>
                          )}
                          <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">
                              {formData.archivo.name}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Tamaño: {(formData.archivo.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <div className="flex justify-center space-x-3">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="cursor-pointer"
                              onClick={() => document.getElementById('file-upload')?.click()}
                            >
                              Cambiar archivo
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={removeFile}
                              className="text-red-600 hover:text-red-700"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Mostrar zona de subida
                        <div>
                          <Upload className={`w-8 h-8 mx-auto mb-2 ${
                            isDragOver ? 'text-blue-500' : 'text-gray-400'
                          }`} />
                          <p className={`text-sm mb-2 ${
                            isDragOver ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {isDragOver 
                              ? 'Suelta el archivo aquí' 
                              : 'Haz click aquí para subir tus archivos o arrástralos hasta aquí'
                            }
                          </p>
                          <p className="text-xs text-gray-500 mb-4">
                            Tamaño máximo de archivo: 25 MB • Formatos: PDF, JPG, PNG
                          </p>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className={`cursor-pointer ${
                              isDragOver ? 'border-blue-400 text-blue-600' : ''
                            }`}
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Seleccionar archivo
                          </Button>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                    </div>
                  </div>

                  {/* Botón de envío */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={formStatus.isLoading}
                      className="w-full silver-blue-gradient hover:opacity-90 text-white py-3 text-lg disabled:opacity-50"
                    >
                      {formStatus.isLoading ? "Enviando..." : "Enviar Solicitud de Cotización"}
                    </Button>
                    <p className="text-sm text-gray-500 text-center mt-3">
                      Te contactaremos en las próximas 24 horas hábiles
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ContactPageContent />
    </Suspense>
  )
} 