export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 AI Assistant App. All rights reserved.
          </div>
          
          <div className="flex space-x-6 text-sm">
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              Privacy
            </button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              Terms
            </button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}