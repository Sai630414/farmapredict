function selectLanguage(language) {
    alert("You selected: " + language);
    if (language === "Telugu") {
        window.location.href = "telugu.html";
    } else if (language === "Hindi") {
        window.location.href = "hindi.html";
    } else if (language === "English") {
        window.location.href = "english.html";
    }
}
