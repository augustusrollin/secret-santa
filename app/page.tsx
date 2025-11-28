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

  const [resetLoading, setResetLoading] = useState(false);
  const [resetResult, setResetResult] = useState<{ message: string; success: boolean } | null>(null);

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

  // Reset Assignments (for testing/development)
  const handleResetAssignments = async () => {
    const confirmed = confirm(
      'This will clear the current assignments and generate new random ones. Continue?'
    );
    if (!confirmed) return;

    setResetLoading(true);
    setResetResult(null);

    try {
      const response = await fetch('/api/reset-assignments', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.ok) {
        setResetResult({
          message: 'Assignments reset! New random assignments will be generated.',
          success: true,
        });
        // Clear any existing reveal results
        setRevealResult(null);
        setSelectedGiverId('');
      } else {
        setResetResult({
          message: data.message || 'Failed to reset assignments.',
          success: false,
        });
      }
    } catch (error) {
      setResetResult({
        message: 'Error resetting assignments. Please try again.',
        success: false,
      });
      console.error(error);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Snowflakes decoration */}
      <div className="snowflakes-container"></div>

      {/* Main content container */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-christmas-snow mb-4 drop-shadow-lg">
            🎅✨ Secret Santa 2025 ✨🎁
          </h1>
          <p className="text-xl text-christmas-snow/90 font-body max-w-2xl mx-auto">
            Welcome to Secret Santa! We're keeping things fun, fair, and full of holiday mystery.
          </p>
        </header>

        {/* Rules & Price Range Section */}
        <section className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border-4 border-christmas-gold">
          <h2 className="text-4xl font-bold text-christmas-red mb-6 text-center">
            🎄 Rules & Guidelines
          </h2>
          <div className="space-y-4 text-lg text-gray-800 font-body">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎁</span>
              <p><strong>Budget:</strong> Please keep gifts in the <span className="text-christmas-red font-semibold">$25–$40</span> range.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <p><strong>Assignment:</strong> Everyone will be assigned one person to surprise.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤫</span>
              <p><strong>Secrecy:</strong> Keep your assignment secret until gift time!</p>
            </div>
          </div>
        </section>

        {/* Participants Section */}
        <section className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border-4 border-christmas-green">
          <h2 className="text-4xl font-bold text-christmas-green mb-6 text-center">
            👥 Participants
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="bg-gradient-to-br from-christmas-red to-christmas-darkRed text-white rounded-lg p-4 text-center font-semibold shadow-lg transform hover:scale-105 transition-transform"
              >
                🎄 {participant.name}
              </div>
            ))}
          </div>
        </section>

        {/* Individual Reveal Section */}
        <section className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border-4 border-christmas-gold">
          <h2 className="text-4xl font-bold text-christmas-red mb-6 text-center">
            🎁 Reveal Your Secret Santa
          </h2>
          <p className="text-gray-700 font-body mb-6 text-center">
            Select your name and click the button to see who you're buying a gift for!
          </p>

          {!revealResult ? (
            <div className="space-y-6">
              {/* Name Selection */}
              <div>
                <label htmlFor="giver-select" className="block text-lg font-semibold text-gray-800 mb-2">
                  Select Your Name:
                </label>
                <select
                  id="giver-select"
                  value={selectedGiverId}
                  onChange={(e) => {
                    setSelectedGiverId(e.target.value);
                    setRevealError(null);
                  }}
                  className="w-full p-4 text-lg border-2 border-christmas-green rounded-lg focus:outline-none focus:ring-4 focus:ring-christmas-gold font-body"
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
                className="w-full bg-gradient-to-r from-christmas-red to-christmas-darkRed text-white text-xl font-bold py-4 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none pulse-glow"
              >
                {revealLoading ? '🎅 Revealing...' : '🎁 Reveal My Secret Santa'}
              </button>

              {/* Error Message */}
              {revealError && (
                <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-lg text-center">
                  {revealError}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Reveal Result */}
              <div className="bg-gradient-to-br from-christmas-green to-christmas-darkGreen text-white p-8 rounded-2xl text-center shadow-2xl">
                <p className="text-2xl mb-4">🎅 {revealResult.giver}, your Secret Santa recipient is...</p>
                <p className="text-5xl font-bold mb-4">✨ {revealResult.receiver} ✨</p>
                <p className="text-xl">🎄 Merry Christmas! 🎄</p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseReveal}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white text-lg font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all"
              >
                ✖️ Hide Result
              </button>

              <p className="text-sm text-gray-600 text-center italic">
                Make sure to hide this before the next person uses the app!
              </p>
            </div>
          )}
        </section>

        {/* SMS/Email Blast Section */}
        <section className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border-4 border-christmas-red">
          <h2 className="text-4xl font-bold text-christmas-red mb-6 text-center">
            📧 Send Assignments via SMS/Email
          </h2>
          <p className="text-gray-700 font-body mb-2 text-center">
            <strong>Host Only:</strong> Click the button below to send everyone their Secret Santa recipient via SMS and/or email.
          </p>
          <p className="text-sm text-gray-600 font-body mb-6 text-center italic">
            Assignments will not be shown on screen.
          </p>

          {/* Send Button */}
          <button
            onClick={handleSendAssignments}
            disabled={sendLoading}
            className="w-full bg-gradient-to-r from-christmas-green to-christmas-darkGreen text-white text-xl font-bold py-4 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {sendLoading ? '📤 Sending...' : '📧 Send All Assignments'}
          </button>

          {/* Send Result */}
          {sendResult && (
            <div
              className={`mt-6 p-4 rounded-lg text-center text-lg font-semibold ${
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

        {/* Reset Assignments Section (Development/Testing) */}
        <section className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border-4 border-christmas-gold">
          <h2 className="text-4xl font-bold text-christmas-gold mb-6 text-center">
            🔄 Reset Assignments
          </h2>
          <p className="text-gray-700 font-body mb-2 text-center">
            <strong>Testing/Development:</strong> Clear current assignments and generate new random ones.
          </p>
          <p className="text-sm text-gray-600 font-body mb-6 text-center italic">
            This will create a completely new random assignment. Useful for testing different scenarios.
          </p>

          {/* Reset Button */}
          <button
            onClick={handleResetAssignments}
            disabled={resetLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xl font-bold py-4 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {resetLoading ? '🔄 Resetting...' : '🔄 Reset & Generate New Assignments'}
          </button>

          {/* Reset Result */}
          {resetResult && (
            <div
              className={`mt-6 p-4 rounded-lg text-center text-lg font-semibold ${
                resetResult.success
                  ? 'bg-green-100 border-2 border-green-500 text-green-800'
                  : 'bg-red-100 border-2 border-red-500 text-red-800'
              }`}
            >
              {resetResult.success ? '✅ ' : '❌ '}
              {resetResult.message}
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

