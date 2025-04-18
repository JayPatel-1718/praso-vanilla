const launchDate = new Date("2025-05-01T00:00:00").getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const timeLeft = launchDate - now;

      // Calculate time components
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      // Format with leading zeros
      const formatted = {
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      };

      // Update each time box
      if (timeLeft >= 0) {
        flipDigit('days', formatted.days);
        flipDigit('hours', formatted.hours);
        flipDigit('minutes', formatted.minutes);
        flipDigit('seconds', formatted.seconds);
      } else {
        // Stop the countdown when time is up
        clearInterval(countdownInterval);
        document.querySelectorAll('.card-front').forEach(card => card.textContent = '00');
      }
    }

    function flipDigit(id, newVal) {
      const box = document.getElementById(id);
      const front = box.querySelector('.card-front');
      const back = box.querySelector('.card-back');
      const flipCard = box.querySelector('.flip-card');

      if (front.textContent !== newVal) {
        back.textContent = newVal;
        flipCard.classList.add('flip');
        
        setTimeout(() => {
          front.textContent = newVal;
          flipCard.classList.remove('flip');
        }, 700);
      }
    }

    // Run countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Initial update to avoid 1-second delay
    updateCountdown();