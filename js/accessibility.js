let fontSize = 100;

document.getElementById('font-size-increase').addEventListener('click', () => {
    fontSize = fontSize === 100 ? 120 : 100;
    document.body.style.fontSize = `${fontSize}%`;
});

document.getElementById('high-contrast').addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
    localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
});

if (localStorage.getItem('highContrast') === 'true') {
    document.body.classList.add('high-contrast');
}