function dsml2html(code) {
    lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replaceAll("hd:","<head>").replaceAll(":nhd","</head>").replaceAll("bd:","<body>").replaceAll(":nbd","</body>").replaceAll("t:","<title>").replaceAll(":nt","</title>").replaceAll("p:","<p>").replaceAll(":np","</p>").replaceAll("h:","<h1>").replaceAll(":nh","</h1>").replaceAll("mq:","<marquee>").replaceAll(":nmq","</marquee>");
    }
    return lines.join("");
}