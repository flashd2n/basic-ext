const start = async () => {
    const io = await IOBrowser();
    
    window.io = io;

    document.getElementsByTagName('h1')[0].onclick = async () => {
        console.log('h1 clicked');
        console.log(io.version);
    }
}

start().catch(console.error);