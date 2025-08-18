window.addEventListener('DOMContentLoaded', () => {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach((alertEl, index) => {
        const alert = bootstrap.Alert.getOrCreateInstance(alertEl);
        setTimeout(() => {
            alert.close();
        }, 3000);
    });
});