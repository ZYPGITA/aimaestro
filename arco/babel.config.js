module.exports = {
    plugins: [
        '@vue/babel-plugin-jsx',
        ["prismjs",
            {
            "languages": ["python"],
            "plugins": ["line-numbers", "line-highlight"],
            "theme": "twilight",
            "css": true
        }]
    ],
};
