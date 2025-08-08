import { ArrowRight, Bot, Sparkles, Users, Zap } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
  language: string
}

export default function LandingPage({ onGetStarted, language }: LandingPageProps) {
  const content = {
    en: {
      tagline: "The AI assistant",
      headline: "transforming your questions into insights.",
      description: "The platform where users interact with advanced AI to get instant, accurate responses to their questions and complex problems.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      features: [
        {
          icon: <Bot className="w-6 h-6" />,
          title: "Advanced AI",
          description: "Powered by state-of-the-art language models"
        },
        {
          icon: <Zap className="w-6 h-6" />,
          title: "Instant Responses",
          description: "Get answers to your questions in seconds"
        },
        {
          icon: <Users className="w-6 h-6" />,
          title: "User Friendly",
          description: "Simple interface designed for everyone"
        }
      ],
      stats: [
        { number: "2", label: "Free requests to try" },
        { number: "∞", label: "Possibilities with AI" },
        { number: "24/7", label: "Always available" }
      ]
    },
    es: {
      tagline: "El asistente de IA",
      headline: "transformando tus preguntas en conocimiento.",
      description: "La plataforma donde los usuarios interactúan con IA avanzada para obtener respuestas instantáneas y precisas a sus preguntas y problemas complejos.",
      getStarted: "Comenzar",
      learnMore: "Saber Más",
      features: [
        {
          icon: <Bot className="w-6 h-6" />,
          title: "IA Avanzada",
          description: "Impulsado por modelos de lenguaje de última generación"
        },
        {
          icon: <Zap className="w-6 h-6" />,
          title: "Respuestas Instantáneas",
          description: "Obtén respuestas a tus preguntas en segundos"
        },
        {
          icon: <Users className="w-6 h-6" />,
          title: "Fácil de Usar",
          description: "Interfaz simple diseñada para todos"
        }
      ],
      stats: [
        { number: "2", label: "Solicitudes gratuitas para probar" },
        { number: "∞", label: "Posibilidades con IA" },
        { number: "24/7", label: "Siempre disponible" }
      ]
    }
  }

  const t = content[language as keyof typeof content] || content.en

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            {/* AI Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-3 shadow-2xl">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {t.tagline}
              </span>
              <br />
              <span className="text-white">
                {t.headline}
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span>{t.getStarted}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="px-8 py-4 border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl font-semibold text-lg transition-colors duration-200">
                {t.learnMore}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {t.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-lg">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {language === 'es' ? 'Listo para comenzar?' : 'Ready to get started?'}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {language === 'es' 
              ? 'Prueba nuestro asistente de IA gratis ahora mismo.'
              : 'Try our AI assistant for free right now.'
            }
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span>{t.getStarted}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}