
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    fontSize: {
      'sm1': '0.75rem',
      sm: '0.8rem',
      base: '1rem',
      md: '1.25rem',
      xl: '1.5rem',
      '0xl': '2rem',
      '1xl': '2.5rem',
      '2xl': '3rem',
      '3xl': '3.5rem',
      '4xl': '4rem',
      '5xl': '4.5rem'
    },
    fontFamily: {
      display: ["Kanit", "sans-serif"],
    },
    dropShadow: {
      '3xl': '0 0 20px rgba(255, 255, 255, 0.8)',
    },
    screens: {
      'sm1': '190px',
      'sm2': '308px',
      'md': '576px',
      'lg': '992px',
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px',
    }
  },
  plugins: [
    function ({addUtilities}){
      const newUtilities = {
        ".scrollber-thin" : {
          scrollbarWidth : "thin",
          scrollbarColor : "white"
        },
        ".scrollber-webkit":{
          "&::-webkit-scrollbar": {
            background: "10px"
          },
          "&::-webkit-scrollbar-track": {
            background: "white"
          },
          "&::-webkit-scrollbar-thumb": {
            background: "white",
            borderRadius: "10px",
            border: "1px soild white"
          }
        }
      }
      addUtilities(newUtilities, ["responsive", "hover"])
    }
  ],
};
