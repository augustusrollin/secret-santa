'use client';

import { useState, useEffect } from 'react';
import { participants } from '@/lib/participants';

export default function Home() {
  const [selectedGiverId, setSelectedGiverId] = useState<string>('');
  const [revealResult, setRevealResult] = useState<{ giver: string; receiver: string } | null>(null);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealError, setRevealError] = useState<string | null>(null);

  const [sendLoading, setSendLoading] = useState(false);
  const [sendResult, setSendResult] = useState<{ message: string; success: boolean } | null>(null);

  // Generate snowflakes for decoration
  useEffect(() => {
    const snowflakeCount = 30;
    const container = document.querySelector('.snowflakes-container');
    if (!container) return;

    for (let i = 0; i < snowflakeCount; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.innerHTML = '❄';
      snowflake.style.left = `${Math.random() * 100}vw`;
      snowflake.style.animationDuration = `${Math.random() * 10 + 10}s`;
      snowflake.style.animationDelay = `${Math.random() * 10}s`;
      snowflake.style.fontSize = `${Math.random() * 1 + 0.5}em`;
      container.appendChild(snowflake);
    }
  }, []);

  // Individual Reveal Mode
  const handleReveal = async () => {
    if (!selectedGiverId) {
      setRevealError('Please select your name first!');
      return;
    }

    setRevealLoading(true);
    setRevealError(null);
    setRevealResult(null);

    try {
      const response = await fetch(`/api/my-recipient?giverId=${selectedGiverId}`);
      if (!response.ok) {
        throw new Error('Failed to retrieve assignment');
      }
      const data = await response.json();
      setRevealResult(data);
    } catch (error) {
      setRevealError('Failed to reveal your Secret Santa. Please try again.');
      console.error(error);
    } finally {
      setRevealLoading(false);
    }
  };

  const handleCloseReveal = () => {
    setRevealResult(null);
    setSelectedGiverId('');
  };

  // SMS/Email Blast Mode
  const handleSendAssignments = async () => {
    const confirmed = confirm(
      'This will send Secret Santa assignments to all participants via SMS and/or email. Continue?'
    );
    if (!confirmed) return;

    setSendLoading(true);
    setSendResult(null);

    try {
      const response = await fetch('/api/send-assignments', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.ok) {
        setSendResult({
          message: data.message || 'Assignments sent successfully!',
          success: true,
        });
      } else {
        setSendResult({
          message: data.message || 'Failed to send assignments.',
          success: false,
        });
      }
    } catch (error) {
      setSendResult({
        message: 'Error sending assignments. Please try again.',
        success: false,
      });
      console.error(error);
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Snowflakes decoration */}
      <div className="snowflakes-container"></div>

      {/* Main content container */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-christmas-snow mb-2 sm:mb-4 drop-shadow-lg leading-tight">
            🎅✨ Secret Santa 2025 ✨🎁
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-christmas-snow/90 font-body max-w-2xl mx-auto px-2">
            Welcome to Secret Santa! We're keeping things fun, fair, and full of holiday mystery.
          </p>
        </header>

        {/* Rules & Price Range Section */}
        <section className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border-2 sm:border-4 border-christmas-gold">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-christmas-red mb-3 sm:mb-4 md:mb-6 text-center">
            🎄 Rules & Guidelines
          </h2>
          <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-gray-800 font-body">
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl flex-shrink-0">🎁</span>
              <p><strong>Budget:</strong> Please keep gifts in the <span className="text-christmas-red font-semibold">$25–$40</span> range.</p>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl flex-shrink-0">✨</span>
              <p><strong>Assignment:</strong> Everyone will be assigned one person to surprise.</p>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl flex-shrink-0">🤫</span>
              <p><strong>Secrecy:</strong> Keep your assignment secret until gift time!</p>
            </div>
          </div>
        </section>

        {/* Participants Section */}
        <section className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border-2 sm:border-4 border-christmas-green">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-christmas-green mb-3 sm:mb-4 md:mb-6 text-center">
            👥 Participants
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="bg-gradient-to-br from-christmas-red to-christmas-darkRed text-white rounded-lg p-3 sm:p-4 text-center font-semibold text-sm sm:text-base shadow-lg transform hover:scale-105 transition-transform"
              >
                🎄 {participant.name}
              </div>
            ))}
          </div>
        </section>

        {/* Individual Reveal Section */}
        <section className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border-2 sm:border-4 border-christmas-gold">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-christmas-red mb-3 sm:mb-4 md:mb-6 text-center">
            🎁 Reveal Your Secret Santa
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-body mb-4 sm:mb-6 text-center px-2">
            Select your name and click the button to see who you're buying a gift for!
          </p>

          {!revealResult ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Name Selection */}
              <div>
                <label htmlFor="giver-select" className="block text-base sm:text-lg font-semibold text-gray-800 mb-2">
                  Select Your Name:
                </label>
                <select
                  id="giver-select"
                  value={selectedGiverId}
                  onChange={(e) => {
                    setSelectedGiverId(e.target.value);
                    setRevealError(null);
                  }}
                  className="w-full p-3 sm:p-4 text-base sm:text-lg border-2 border-christmas-green rounded-lg focus:outline-none focus:ring-4 focus:ring-christmas-gold font-body"
                >
                  <option value="">-- Choose your name --</option>
                  {participants.map((participant) => (
                    <option key={participant.id} value={participant.id}>
                      {participant.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reveal Button */}
              <button
                onClick={handleReveal}
                disabled={revealLoading || !selectedGiverId}
                className="w-full bg-gradient-to-r from-christmas-red to-christmas-darkRed text-white text-lg sm:text-xl font-bold py-4 sm:py-5 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none pulse-glow touch-manipulation"
              >
                {revealLoading ? '🎅 Revealing...' : '🎁 Reveal My Secret Santa'}
              </button>

              {/* Error Message */}
              {revealError && (
                <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 sm:p-4 rounded-lg text-center text-sm sm:text-base">
                  {revealError}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Reveal Result */}
              <div className="bg-gradient-to-br from-christmas-green to-christmas-darkGreen text-white p-6 sm:p-8 rounded-xl sm:rounded-2xl text-center shadow-2xl">
                <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4">🎅 {revealResult.giver}, your Secret Santa recipient is...</p>
                <p className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">✨ {revealResult.receiver} ✨</p>
                <p className="text-lg sm:text-xl">🎄 Merry Christmas! 🎄</p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseReveal}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white text-base sm:text-lg font-bold py-3 sm:py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all touch-manipulation"
              >
                ✖️ Hide Result
              </button>

              <p className="text-xs sm:text-sm text-gray-600 text-center italic px-2">
                Make sure to hide this before the next person uses the app!
              </p>
            </div>
          )}
        </section>

        {/* SMS/Email Blast Section */}
        <section className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border-2 sm:border-4 border-christmas-red">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-christmas-red mb-3 sm:mb-4 md:mb-6 text-center">
            📧 Send Assignments via SMS/Email
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-body mb-2 text-center px-2">
            <strong>Host Only:</strong> Click the button below to send everyone their Secret Santa recipient via SMS and/or email.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 font-body mb-4 sm:mb-6 text-center italic px-2">
            Assignments will not be shown on screen.
          </p>

          {/* Send Button */}
          <button
            onClick={handleSendAssignments}
            disabled={sendLoading}
            className="w-full bg-gradient-to-r from-christmas-green to-christmas-darkGreen text-white text-lg sm:text-xl font-bold py-4 sm:py-5 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
          >
            {sendLoading ? '📤 Sending...' : '📧 Send All Assignments'}
          </button>

          {/* Send Result */}
          {sendResult && (
            <div
              className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg text-center text-base sm:text-lg font-semibold ${
                sendResult.success
                  ? 'bg-green-100 border-2 border-green-500 text-green-800'
                  : 'bg-red-100 border-2 border-red-500 text-red-800'
              }`}
            >
              {sendResult.success ? '✅ ' : '❌ '}
              {sendResult.message}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-christmas-snow/80 font-body mt-12">
          <p className="text-lg">🎄 Happy Holidays! 🎁</p>
          <p className="text-sm mt-2">Secret Santa 2025 • Made with ❤️ and Christmas magic</p>
        </footer>
      </div>
    </main>
  );
}

