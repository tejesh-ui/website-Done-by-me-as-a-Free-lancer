module.exports = Object.assign({content:['./*.html','./components/**/*.js','./js/**/*.js']}, {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            DEFAULT: '#722F37', // Deep Maroon
                            hover: '#5A252C',
                            light: '#F8F5F2', // Ivory background
                        },
                        accent: {
                            gold: '#D4AF37',
                            light: '#F5DEB3'
                        },
                        neutral: {
                            100: '#FFFFFF',
                            200: '#FDFBF7',
                            300: '#EAE6DF',
                            800: '#2C2A29', // Dark brown text
                            900: '#1A1817'
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        serif: ['Playfair Display', 'serif'],
                    },
                    boxShadow: {
                        'premium': '0 4px 20px -2px rgba(114, 47, 55, 0.05)',
                        'card': '0 2px 10px rgba(0, 0, 0, 0.03)'
                    }
                }
            }
        })
