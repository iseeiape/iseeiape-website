import { useState, useEffect } from 'react';
import { Check, X, Zap, Shield, TrendingUp, BarChart3, Bell, Globe, Users, Clock } from 'lucide-react';

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  free: boolean;
  premium: boolean;
  pro: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export default function PremiumDashboard() {
  const [selectedTier, setSelectedTier] = useState<string>('pro');
  const [userTier, setUserTier] = useState<string>('free');
  
  const features: PremiumFeature[] = [
    {
      id: 'realtime',
      name: 'Real-time Whale Alerts',
      description: 'Instant notifications for large wallet movements',
      icon: <Bell className="w-5 h-5" />,
      free: true,
      premium: true,
      pro: true
    },
    {
      id: 'advanced',
      name: 'Advanced Analytics',
      description: 'Deep dive into wallet patterns and trading strategies',
      icon: <BarChart3 className="w-5 h-5" />,
      free: false,
      premium: true,
      pro: true
    },
    {
      id: 'api',
      name: 'API Access',
      description: 'Programmatic access to all data feeds',
      icon: <Globe className="w-5 h-5" />,
      free: false,
      premium: false,
      pro: true
    },
    {
      id: 'community',
      name: 'Premium Community',
      description: 'Access to private Discord with top traders',
      icon: <Users className="w-5 h-5" />,
      free: false,
      premium: true,
      pro: true
    },
    {
      id: 'priority',
      name: 'Priority Support',
      description: '24/7 dedicated support team',
      icon: <Shield className="w-5 h-5" />,
      free: false,
      premium: false,
      pro: true
    },
    {
      id: 'historical',
      name: 'Historical Data',
      description: 'Access to 2+ years of historical whale data',
      icon: <Clock className="w-5 h-5" />,
      free: false,
      premium: true,
      pro: true
    },
    {
      id: 'predictive',
      name: 'Predictive Analytics',
      description: 'AI-powered price movement predictions',
      icon: <TrendingUp className="w-5 h-5" />,
      free: false,
      premium: false,
      pro: true
    },
    {
      id: 'automation',
      name: 'Trading Automation',
      description: 'Set up automated trading strategies',
      icon: <Zap className="w-5 h-5" />,
      free: false,
      premium: false,
      pro: true
    }
  ];

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Basic whale alerts and market data',
      features: [
        'Basic whale alerts',
        '24h market data',
        'Community access',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$49',
      period: 'month',
      description: 'Advanced analytics for serious traders',
      features: [
        'All Free features',
        'Advanced analytics',
        'Historical data (6 months)',
        'Premium community',
        'Priority email support'
      ],
      cta: 'Upgrade Now',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$199',
      period: 'month',
      description: 'Complete trading suite for professionals',
      features: [
        'All Premium features',
        'API access',
        'Predictive analytics',
        'Trading automation',
        '24/7 phone support',
        'Custom integrations'
      ],
      cta: 'Go Pro',
      popular: false
    }
  ];

  const selectedTierData = pricingTiers.find(tier => tier.id === selectedTier);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🦎 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Premium Features</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Unlock advanced trading intelligence and automation tools to maximize your profits
          </p>
        </div>

        {/* Features Comparison */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-2">Feature</th>
                  <th className="text-center py-4 px-2">Free</th>
                  <th className="text-center py-4 px-2">Premium</th>
                  <th className="text-center py-4 px-2">Pro</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="text-blue-400">
                          {feature.icon}
                        </div>
                        <div>
                          <div className="font-medium">{feature.name}</div>
                          <div className="text-sm text-gray-400">{feature.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      {feature.free ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-2">
                      {feature.premium ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-2">
                      {feature.pro ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-gray-800/50 rounded-2xl p-6 border-2 transition-all duration-300 ${
                  tier.popular
                    ? 'border-blue-500 transform scale-105'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                {tier.popular && (
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold py-1 px-4 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-gray-400 ml-2">/{tier.period}</span>
                  </div>
                  <p className="text-gray-400">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedTier(tier.id)}
                  className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Tier Details */}
        {selectedTierData && (
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Ready to upgrade to <span className="text-blue-400">{selectedTierData.name}</span>?
                </h2>
                <p className="text-gray-400">
                  Get started in minutes. Cancel anytime.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300">
                  Start {selectedTierData.name} Trial
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">What You Get</h3>
                <ul className="space-y-3">
                  {selectedTierData.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Estimated Value</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Time saved per week</span>
                    <span className="font-bold">10-15 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Potential ROI</span>
                    <span className="font-bold text-green-400">300-500%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Community access</span>
                    <span className="font-bold">$500+ value</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Support response time</span>
                    <span className="font-bold">&lt; 1 hour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="bg-gray-800/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">Yes, you can cancel your subscription at any time. No questions asked.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Is there a free trial?</h3>
              <p className="text-gray-400">Yes! All paid plans come with a 7-day free trial. No credit card required for the trial.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">We accept credit cards, PayPal, and cryptocurrency (BTC, ETH, SOL).</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-400">Yes, you can change your plan at any time. Changes take effect immediately.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}