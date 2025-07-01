import React from 'react'
import Link from 'next/link'
import { 
  CheckCircleIcon, 
  DocumentTextIcon, 
  ClipboardDocumentListIcon,
  SparklesIcon,
  UsersIcon,
  CloudIcon 
} from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient">TaskCore</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">
                Demo
              </Link>
              <Link href="/auth/login" className="btn-primary">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            The Ultimate{' '}
            <span className="text-gradient">Productivity Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Combine task management, knowledge base, and punch list workflows in one powerful platform. 
            Built for teams that demand excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
              Start Free Trial
            </Link>
            <Link href="#demo" className="btn-secondary text-lg px-8 py-3">
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              TaskCore combines the best features from multiple productivity tools into one seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Task Management */}
            <div className="card p-8 text-center hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Task Management</h3>
              <p className="text-gray-600 mb-4">
                Asana-like project and task management with Kanban boards, timelines, and calendar views.
              </p>
              <ul className="text-sm text-gray-500 text-left space-y-2">
                <li>• Project hierarchies & sections</li>
                <li>• Task dependencies & subtasks</li>
                <li>• Multiple view types</li>
                <li>• Time tracking & reporting</li>
              </ul>
            </div>

            {/* Knowledge Base */}
            <div className="card p-8 text-center hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DocumentTextIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Knowledge Base</h3>
              <p className="text-gray-600 mb-4">
                Notion-like pages with rich text editing, embeds, and real-time collaboration.
              </p>
              <ul className="text-sm text-gray-500 text-left space-y-2">
                <li>• Rich text blocks & templates</li>
                <li>• Hierarchical page structure</li>
                <li>• Real-time collaboration</li>
                <li>• Version history & comments</li>
              </ul>
            </div>

            {/* Punch Lists */}
            <div className="card p-8 text-center hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardDocumentListIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Punch Lists</h3>
              <p className="text-gray-600 mb-4">
                Construction & QA focused workflows with photo annotations and OCR text extraction.
              </p>
              <ul className="text-sm text-gray-500 text-left space-y-2">
                <li>• Photo upload & annotation</li>
                <li>• PaddleOCR text extraction</li>
                <li>• Location & reference tracking</li>
                <li>• Approval workflows</li>
              </ul>
            </div>

            {/* AI Assistant */}
            <div className="card p-8 text-center hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SparklesIcon className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Assistant</h3>
              <p className="text-gray-600 mb-4">
                Integrated AI powered by Open WebUI for task summaries, search, and project analytics.
              </p>
              <ul className="text-sm text-gray-500 text-left space-y-2">
                <li>• Task summarization</li>
                <li>• Intelligent search</li>
                <li>• Project insights</li>
                <li>• Content generation</li>
              </ul>
            </div>

            {/* Integrations */}
            <div className="card p-8 text-center hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CloudIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Integrations</h3>
              <p className="text-gray-600 mb-4">
                Zapier-style automation engine with connections to Slack, GitHub, Google Drive, and more.
              </p>
              <ul className="text-sm text-gray-500 text-left space-y-2">
                <li>• Slack & email notifications</li>
                <li>• GitHub issue sync</li>
                <li>• Cloud storage integration</li>
                <li>• Custom automation rules</li>
              </ul>
            </div>

            {/* Collaboration */}
            <div className="card p-8 text-center hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UsersIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Collaboration</h3>
              <p className="text-gray-600 mb-4">
                Real-time collaboration with role-based permissions and team management.
              </p>
              <ul className="text-sm text-gray-500 text-left space-y-2">
                <li>• Organization & team management</li>
                <li>• Role-based permissions</li>
                <li>• Real-time updates</li>
                <li>• Activity tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            See TaskCore in Action
          </h2>
          <div className="bg-gray-900 rounded-lg p-8 max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <p className="text-white text-lg">Demo Video Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of teams already using TaskCore to streamline their productivity.
          </p>
          <Link href="/auth/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TaskCore</h3>
              <p className="text-gray-400">
                The ultimate modular productivity platform for modern teams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TaskCore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}