import PremiumDashboard from '../components/PremiumDashboard';
import Head from 'next/head';
import Link from 'next/link';

export default function PremiumPage() {
  return (
    <>
      <Head>
        <title>🦎 Premium Features - iseeiape</title>
        <meta name="description" content="Unlock advanced trading intelligence, whale alerts, and automation tools with iseeiape Premium" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Navigation */}
        <nav className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
                <span className="text-xl font-bold">iseeiape</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">Premium</span>
              </div>
              <div className="flex space-x-4">
                <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
                <Link href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link>
                <Link href="/premium" className="text-blue-400">Premium</Link>
                <Link href="/about" className="text-gray-400 hover:text-white">About</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Premium Dashboard Component */}
        <PremiumDashboard />

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
                  <span className="text-xl font-bold">iseeiape</span>
                </div>
                <p className="text-gray-400">
                  Advanced crypto intelligence platform for serious traders.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                  <li><Link href="/premium" className="hover:text-white">Premium Features</Link></li>
                  <li><Link href="/api" className="hover:text-white">API</Link></li>
                  <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Resources</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                  <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                  <li><Link href="/guides" className="hover:text-white">Guides</Link></li>
                  <li><Link href="/community" className="hover:text-white">Community</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                  <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} iseeiape. All rights reserved.</p>
              <p className="mt-2">Not financial advice. Trade at your own risk.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}