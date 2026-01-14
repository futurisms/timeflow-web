'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function MobileWaitlistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    feedback: '',
    interestedFeatures: [] as string[],
  });

  const features = [
    { id: 'unlimited', label: '✨ Unlimited cards', description: 'Create as many wisdom cards as you want' },
    { id: 'ai-images', label: '🎨 AI-generated images', description: 'Beautiful custom artwork on each card' },
    { id: 'offline', label: '📴 Offline access', description: 'Access your cards anywhere, anytime' },
    { id: 'notifications', label: '🔔 Daily wisdom', description: 'Get inspired every day with push notifications' },
    { id: 'gestures', label: '💫 Swipe gestures', description: 'Smooth, native mobile experience' },
    { id: 'sharing', label: '🔗 Viral sharing', description: 'Share cards that open directly in the app' },
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || '');
      
      // Check if already submitted
      const { data } = await supabase
        .from('mobile_waitlist')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setSubmitted(true);
        setFormData({
          name: data.name || '',
          feedback: data.feedback || '',
          interestedFeatures: data.interested_features || [],
        });
      }
    }
  };

  const toggleFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      interestedFeatures: prev.interestedFeatures.includes(featureId)
        ? prev.interestedFeatures.filter(f => f !== featureId)
        : [...prev.interestedFeatures, featureId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('mobile_waitlist')
        .upsert({
          user_id: user.id,
          name: formData.name,
          email: userEmail,
          feedback: formData.feedback,
          interested_features: formData.interestedFeatures,
        });

      if (error) throw error;

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting waitlist:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            You're on the List!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We'll notify you at <strong>{userEmail}</strong> as soon as the mobile app launches.
          </p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              What happens next?
            </h2>
            <ul className="text-left text-blue-800 space-y-2">
              <li>✅ We'll build the features you want</li>
              <li>✅ You'll get early access before launch</li>
              <li>✅ Special launch discount for waitlist members</li>
            </ul>
          </div>
          <button
            onClick={() => router.push('/my-cards')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all"
          >
            Back to My Cards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📱✨</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            You've Hit Your Limit
          </h1>
          <p className="text-2xl text-gray-600 mb-2">
            You've created <strong>5 out of 5</strong> wisdom cards
          </p>
          <p className="text-lg text-gray-500">
            Want unlimited cards? The mobile app is coming soon!
          </p>
        </div>

        {/* Mobile App Features */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Timeflow Mobile App
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Everything you love, plus powerful new features
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.interestedFeatures.includes(feature.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {formData.interestedFeatures.includes(feature.id) ? (
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Waitlist Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-t-2 border-gray-100 pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Join the Waitlist
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll notify you at this email when the app launches
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What features are you most excited about? (Select above)
                  </label>
                  <p className="text-sm text-gray-500">
                    {formData.interestedFeatures.length === 0 
                      ? 'Click the features above that interest you most'
                      : `${formData.interestedFeatures.length} feature${formData.interestedFeatures.length === 1 ? '' : 's'} selected`
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Any feedback or feature requests? (Optional)
                  </label>
                  <textarea
                    value={formData.feedback}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                    placeholder="Tell us what you'd like to see in the mobile app..."
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => router.push('/my-cards')}
                className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all"
              >
                Back to My Cards
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Join Waitlist'}
              </button>
            </div>
          </form>
        </div>

        {/* Social Proof */}
        <div className="text-center text-gray-600">
          <p className="text-sm">
            🚀 Launching soon on iOS and Android
          </p>
        </div>
      </div>
    </div>
  );
}
