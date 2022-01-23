module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      flex: {
        full: '1 1 100%'
      },
      fontFamily: {
        'open-sans': ['Open Sans, sans-serif'],
        'obidee-sans': ['Odibee Sans, cursive']
      },
      colors: {
        royal: {
          blue: '#5272FF',
          white: '#F9F7FF',
          black: '#464555'
        }
      },
      animation: {
        'fade-in': 'fade-in 1s 1 ease forwards',
        'fade-in-bottom': 'fade-in-bottom 0.75s ease-in-out',
        'wobble-bottom': 'wobble-bottom 1.5s ease infinite'
      },
      keyframes: theme => ({
        'fade-in': {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        },
        'fade-in-bottom': {
          '0%': {
            opacity: 0,
            transform: 'translateY(50px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0px)'
          }
        },
        'wobble-bottom': {
          '0%, 100%': {
            transform: 'translateX(0%)',
            'transform-origin': '50% 50%'
          },
          '15%': {
            transform: 'translateX(-3px) rotate(-1deg)'
          },
          '30%': {
            transform: 'translateX(2px) rotate(1deg)'
          },
          '45%': {
            transform: 'translateX(-2px) rotate(-0.6deg)'
          },
          '60%': {
            transform: 'translateX(0px) rotate(0.4deg)'
          },
          '75%': {
            transform: 'translateX(0px) rotate(-0.6deg)'
          }
        }
      })
    },
  },
  plugins: [],
}
