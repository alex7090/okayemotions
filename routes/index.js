const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const multer = require('multer');
const path = require('path');
var query = require('../config/query');
const uuid = require('uuid').v4;
const fs = require("fs");
const disk = require('diskusage');
const PDFDocument = require('pdfkit');
const os = require('os');
let _path = os.platform() === 'win32' ? 'c:' : '/';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        var { firstName, lastName, email, name, plateform, credit, tag, description, customCheck1, customCheck2, signature, link , date, city} = req.body;
        firstName = firstName.replace(/'/g, "''");
        lastName = lastName.replace(/'/g, "''");
        name = name.replace(/'/g, "''");
        credit = credit.replace(/'/g, "''");
        description = description.replace(/'/g, "''");
        console.log(description);
        console.log(date, city);
        const ext = path.extname(file.originalname);
        const id = uuid();
        const filepath = `${file.originalname}`;
        fs.mkdir(`./uploads/${id}`, function (err) {
            if (err) {
                console.log(err)
            } else {
                const doc = new PDFDocument();
                let ts = Date.now();

                let date_ob = new Date(ts);
                let _date = date_ob.getDate();
                let month = date_ob.getMonth() + 1;
                let year = date_ob.getFullYear();

                doc.pipe(fs.createWriteStream(`./uploads/${id}/contrat.pdf`));
                doc
                    .fontSize(24)
                    .font('Times-Bold')
                    .text(`Licensing agreement`, {
                        underline: true,
                        align: 'center'
                    })
                    .moveDown()
                    .moveDown()
                    .font('Times-Roman')
                    .fontSize(12)
                    .text(`This Agreement is made between : ${firstName} ${lastName}`)
                    .moveDown()
                    .text('Hereinafter referred to as the « ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' », on the one hand ;')
                    .moveDown()
                    .text('AND ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions')
                    .font('Times-Roman')
                    .moveDown()
                    .text('Hereinafter referred to as the « ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' », or « ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' », on the otherhand.')
                    .moveDown()
                    .text('The ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' and the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' are hereinafter collectively referred to as the “', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Parties', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('” and individually, as the context requires, as “', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Party', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('”.')
                    .moveDown()
                    .moveDown()
                    .font('Times-Bold')
                    .text('PREAMBLE', {
                        underline: true
                    })
                    .moveDown()
                    .font('Times-Roman')
                    .text('The purpose of this contract is to define the terms and conditions under which the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' transfers exclusively to the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(', who accepts it, the intellectual property rights on the Content, except the moral rights, for its exploitation by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee.', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' The ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' shall select the contents proposed by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to publish them on its accounts « ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' », on the social networks, including Instagram and TikTok. The content will be published on the social networks by crediting the username provided by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('. The publication thus allows the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to gain visibility.')
                    .moveDown()
                    .font('Times-Roman')
                    .text('By the present contract, the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' declares that he is the author of the content that he assigns.')
                    .moveDown()
                    .font('Times-Roman')
                    .text('As the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(', you affirm that you have read and understand the entire contract.')
                    .moveDown()
                    .text('You acknowledge that you are 18 (eighteen) years old or older in order to submit your content to us and assign your rights. If you are under 18 years old, it is possible that your parents assume this responsibility and assign the copyright to us on your behalf. We allow the possibility for your legal guardian to sign this document. If you are the representative of a juridical person, you guarantee that you have obtained the rights and the necessary authorizations from the persons concerned to transmit the present content to us.')
                    .moveDown()
                    .text('By signing the contract, you accept that all information contained therein is transmitted to ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(', and understand that you assign your intellectual property rights to the latter.')
                    .moveDown()
                    .addPage()
                    .font('Times-Bold')
                    .text('        1. THE CONTENT')
                    .moveDown()
                    .font('Times-Roman')
                    .text('The content assigned under this contract corresponds to all elements covered by the copyright communicated by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(', and mainly videos intended for broadcast on social networks. The Content that the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' accepts to assign to the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' may take the form of:')
                    .moveDown()
                    .text('        · Sounds, music')
                    .moveDown()
                    .text('        · Video')
                    .moveDown()
                    .text('        · Video editing')
                    .moveDown()
                    .text('        · Music composition')
                    .moveDown()
                    .text('        · Images')
                    .moveDown()
                    .text('        · Drawing and editing')
                    .moveDown()
                    .text('        · Logos')
                    .moveDown()
                    .text('        · Visual interfaces')
                    .moveDown()
                    .text('        · Audiovisual equipment')
                    .moveDown()
                    .text('        · Voice recording')
                    .moveDown()
                    .font('Times-Roman')
                    .text('By the present contract, the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' guarantees that the content is not contrary to the public policy rules and to the good morals. In any case, the content transmitted will be regularly controlled and the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('  has the right to refuse it. In case of refusal, none of the rules of this contract shall apply.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' reserves the right to refuse the Content submitted by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" if it doesn't respect the selection criteria of ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" (duration, story, editing, quality, etc).")
                    .moveDown()
                    .text('The ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' warrants that the content does not contain any viruses or anything dubious or suspicious and detrimental to ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(". As the ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(', you always have the option to continue broadcasting the Content on your personal accounts on social networks such as Facebook, YouTube, Instagram or Snapchat for personal use.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        2. THE RIGHTS ASSIGNED')
                    .moveDown()
                    .font('Times-Roman')
                    .text('The ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' guarantees that the Content has not been assigned to third parties inthe past and will not be assigned in the future.')
                    .moveDown()
                    .text('The Parties agree that the rights of the content are assigned by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" on an exclusive basis for direct or indirect exploitation, including for commercial use by the ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' becomes the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" of all exploitation rights of the ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' on the content, meaning the reproduction rights, representation, secondary and derived uses of the content.')
                    .moveDown()
                    .text('The reproduction right includes notably:')
                    .moveDown()
                    .text('- the right to reproduce or to have reproduced, to record or to have recorded by all known or unknown technical processes to this date, on all known or unknown supports to this date, in all formats;')
                    .moveDown()
                    .text('- the right to establish or have established, to exploit or have exploited the Contents, in all formats and by all known or unknown processes to this date;')
                    .moveDown()
                    .text('- the right to translate, arrange, modify, adapt and transform all or part in any form of the Content;')
                    .moveDown()
                    .text('- the right to put or have put into circulation and to exploit or have exploited the Contents on all supports.')
                    .moveDown()
                    .text('The right of representation includes notably the right to represent or have represented the Contents to the public in whole or in part, by any existing or to be discovered means of communication, notably via the social networks Instagram and TikTok.')
                    .moveDown()
                    .text('The right of adaptation includes notably the right to modify and adapt the Content.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        3. THE COUNTERPART OF THE ASSIGNMENT IN A FORM OF CREDIT(VISIBILITY)')
                    .moveDown()
                    .font('Times-Roman')
                    .text('In counterpart of all exclusive rights assigned by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(', the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" offers the visibility to the ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" on the " + ' Okayemotions "' + " social networks accounts  where the Contents are published. However, the present Contract is not monetized and doesn't give rise to any financial consideration.")
                    .moveDown()
                    .text('To this day, the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' uses only the social networks Instagram and TikTok, but ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' reserves the right to publish the Content on other social networks in the future.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        4. DURATION OF THE RIGHTS ASSIGNED')
                    .moveDown()
                    .font('Times-Roman')
                    .text("The rights listed in Article 2 of the Contract are assigned from the date of signature of this Contract for the duration of copyright protection (during the author's lifetime and 70 years after his death).")
                    .moveDown()
                    .font('Times-Bold')
                    .text('        5. END OF THE CONTRACT')
                    .moveDown()
                    .font('Times-Roman')
                    .text('The Contract is concluded for the entire duration of the copyright protection.')
                    .moveDown()
                    .text('In case one of one of the Parties wishes to terminate the Contract, he must inform the other Party by writing within a period of at least 30 days. You will find a file in PDF format (Annex n°1) to be filled in and sent to us by e-mail at the following address: ', {
                        //here it is, 
                        continued: true
                    })
                    .fillColor('blue')
                    .text('​contact@okayemotions.com​.')
                    .fillColor('black')
                    .moveDown()
                    .text('The Contract may also be terminated by mutual consent. The termination of the Contract must be confirmed by e-mail by both parties to the Contract. You agree that we can use your email address to send you this notification.')
                    .moveDown()
                    .text('In the case of a breach of contract by either ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Party', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to the Contract, ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' will cease any further publication of the assigned Content 30 days after confirmation of such agreement; notwithstanding the foregoing, the Content can continue to remain on our pages, and possibly monetized.')


                    .moveDown()
                    .text('All agreements relating to the Content ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('that began prior to the termination date', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' will continue beyond the termination date.')
                    .moveDown()
                    .text('If you fail to comply with any term of this agreement, we may terminate this agreement.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        6. TERRITORIALITY')
                    .moveDown()
                    .font('Times-Roman')
                    .text('The assignment of rights is consented for the entire world.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        7. CLAIM')
                    .moveDown()

                    .font('Times-Roman')
                    .text('For any claim or inconvenience, we kindly ask you to contact us at the following email address: ', {
                        //here it is, 
                        continued: true
                    })
                    .fillColor('blue')
                    .text('​contact@okayemotions.com​.')
                    .fillColor('black')
                    .moveDown()
                    .text('In return of your request, you will receive a confirmation and return by e-mail to your personal address.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        8. GUARANTEE')
                    .moveDown()
                    .font('Times-Roman')
                    .text('The ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' guarantees to the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" the full and free enjoyment of the rights assigned, against any and all troubles, claims and evictions. The ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' declares that he is the author of the content and declares that, where applicable, he has concluded a contract of assignment of image rights with the persons appearing in the content, which covers the use made of it by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' The ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' guarantees that the contents are entirely original and do not contain any borrowed work of any nature whatsoever, which would be susceptible of directly or indirectly engaging the responsibility of the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('.')
                    .moveDown()
                    .font('Times-Roman')
                    .text('In particular, if the content contains any distinctive signs of any kind whatsoever, illustrations, texts, tables, graphics, photographs, trademarks, and/or other elements belonging to third parties, the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' undertakes to have obtained in advance of the effective date of the assignment all necessary authorizations for their use by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" within the framework of the present contract. The ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' guarantees the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' against its personal actions and against any claim or eviction of any kind (in particular, any action for counterfeit, copyright infringement, plagiarism or unfair competition) that may be brought against the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' by a third party, having as its basis and/or origin the exploitation of the content, the present assignment of the rights to this content, their reproduction by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' under the conditions of the present contract, and in any other form, the execution of this contract. In this respect, the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' undertakes to reimburse the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' for all indemnification that the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" would be ordered to pay as well as the attorney's fees that the ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" would have to incur in order to organize its defense in this respect.")
                    .moveDown()
                    .font('Times-Bold')
                    .text('        9. APPLICABLE LAW AND THE COMPETENT JURISDICTION')
                    .moveDown()
                    .font('Times-Roman')
                    .text('The present contract is to be governed for all purposes by and construed in accordance with the governing law of French.')
                    .moveDown()
                    .text('An amicable phase is advocated before any judicial proceedings by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Parties', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to the Contract. As a ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Party', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" to the Contract, in case of disagreement or problem the ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" undertakes to contact ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' via the PDF form attached to the Contract and to send a claim before initiating any judicial proceedings.')
                    .moveDown()
                    .text('In case of any dispute in relation to the present Contract, the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Parties', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' attribute anexclusive competence to the jurisdictions of Paris (French).')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        10. SIGNATURE AND PERSONAL INFORMATION')
                    .moveDown()
                    .font('Times-Roman')
                    .text('By signing the present contract you affirm that you have taken knowledge of the preceding provisions. You assign your intellectual property rights relating to the content ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('exclusively', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions company', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('.')
                    .moveDown()
                    .text('You must mention your last name, first name, e-mail address, and an electronic signature will be requested. You also attest that these informations are yours and exclude ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' from any responsibility in case of usurped identity and information.')
                    .moveDown()
                    .text('Automatically after the electronic signature of the Contract a file containing the personal information that you have shared with ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' will be generated. We commit ourselves to not share this personal information with third parties and to limit their use to a strictly professional purpose.')
                    .moveDown()
                    .text("In particular, your personal information will be used in the case of a dispute relating to the Content to demonstrate your right of authorship of the Content.")
                    .moveDown()
                    .font('Times-Bold')
                    .text('ANNEX N°1 :')
                    .text('CLAIM/TERMINATION FORM', {
                        underline: true,
                        link: "/annexe",
                    })
                    .addPage()
                    .font('Times-Roman')
                    .font('Times-Italic')
                    .moveDown()
                    .moveDown()
                    .font('Times-Italic')
                    .text(firstName + " " + lastName)
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('Full Legal Name')
                    .moveDown()
                    .moveDown()
                    .image(signature, {
                        fit: [200, 200],
                    })
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('My Signature')
                    .moveDown()
                    .moveDown()
                    .font('Times-Italic')
                    .text(year + "-" + month + "-" + _date)
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('Date')
                    .moveDown()
                    .moveDown()
                    .font('Times-Italic')
                    .text(email)
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('My Email Adress')
                    .moveDown()
                    .moveDown()
                    .font('Times-Italic')
                    .text(name)
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('Clip URL or Filename')





                    .moveDown()
                    .moveDown()
                    .font('Times-Italic')
                    .text(city)
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('Was recorded in')


                    
                    .moveDown()
                    .moveDown()
                    .font('Times-Italic')
                    .text(date)
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('Was recorded the');
                doc.end();
                query("INSERT INTO public.data (fname, lname, email, vname, credit, platform, link, type, ext, description, tag, storage, city, date) values('" + firstName + "', '" + lastName + "', '" + email + "', '" + name + "', '" + credit + "', '" + plateform + "', '" + id + "', 'file', '" + ext + "', '" + description + "', '" + tag + "', '" + id + "', '" + city + "', '" + date + "')", [], (err, rows) => {
                    console.log("id = " + id);
                    console.log("name = " + name);
                    console.log("ext = " + ext);
                    cb(null, `./${id}/${name}${ext}`);
                });
            }
        })
    },
})

const upload = multer({ storage });


router.post('/upload', upload.single('file'), (req, res) => {
    var { firstName, lastName, email, name, plateform, credit, tag, description, customCheck1, customCheck2, signature, link, date, city } = req.body;
    firstName = firstName.replace(/'/g, "''");
    lastName = lastName.replace(/'/g, "''");
    name = name.replace(/'/g, "''");
    credit = credit.replace(/'/g, "''");
    description = description.replace(/'/g, "''");
    console.log(date);
    console.log(city);
    if (req.file) {
        res.redirect('thanks');
    } else {
        const id = uuid();
        fs.mkdir(`./uploads/${id}`, function (err) {
            if (err) {
                console.log(err)
            } else {
                const doc = new PDFDocument();
                let ts = Date.now();

                let date_ob = new Date(ts);
                let _date = date_ob.getDate();
                let month = date_ob.getMonth() + 1;
                let year = date_ob.getFullYear();

                doc.pipe(fs.createWriteStream(`./uploads/${id}/contrat.pdf`));
                doc
                    .fontSize(24)
                    .font('Times-Bold')
                    .text(`Licensing agreement`, {
                        underline: true,
                        align: 'center'
                    })
                    .moveDown()
                    .moveDown()
                    .font('Times-Roman')
                    .fontSize(12)
                    .text(`This Agreement is made between : ${firstName} ${lastName}`)
                    .moveDown()
                    .text('Hereinafter referred to as the « ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' », on the one hand ;')
                    .moveDown()
                    .text('AND ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions')
                    .font('Times-Roman')
                    .moveDown()
                    .text('Hereinafter referred to as the « ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' », or « ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' », on the otherhand.')
                    .moveDown()
                    .text('The ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' and the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' are hereinafter collectively referred to as the “', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Parties', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('” and individually, as the context requires, as “', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Party', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('”.')
                    .moveDown()
                    .moveDown()
                    .font('Times-Bold')
                    .text('PREAMBLE', {
                        underline: true
                    })
                    .moveDown()
                    .font('Times-Roman')
                    .text('The purpose of this contract is to define the terms and conditions under which the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' transfers exclusively to the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(', who accepts it, the intellectual property rights on the Content, except the moral rights, for its exploitation by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee.', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' The ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' shall select the contents proposed by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to publish them on its accounts « ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' », on the social networks, including Instagram and TikTok. The content will be published on the social networks by crediting the username provided by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('. The publication thus allows the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to gain visibility.')
                    .moveDown()
                    .font('Times-Roman')
                    .text('By the present contract, the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' declares that he is the author of the content that he assigns.')
                    .moveDown()
                    .font('Times-Roman')
                    .text('As the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(', you affirm that you have read and understand the entire contract.')
                    .moveDown()
                    .text('You acknowledge that you are 18 (eighteen) years old or older in order to submit your content to us and assign your rights. If you are under 18 years old, it is possible that your parents assume this responsibility and assign the copyright to us on your behalf. We allow the possibility for your legal guardian to sign this document. If you are the representative of a juridical person, you guarantee that you have obtained the rights and the necessary authorizations from the persons concerned to transmit the present content to us.')
                    .moveDown()
                    .text('By signing the contract, you accept that all information contained therein is transmitted to ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(', and understand that you assign your intellectual property rights to the latter.')
                    .moveDown()
                    .addPage()
                    .font('Times-Bold')
                    .text('        1. THE CONTENT')
                    .moveDown()
                    .font('Times-Roman')
                    .text('The content assigned under this contract corresponds to all elements covered by the copyright communicated by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(', and mainly videos intended for broadcast on social networks. The Content that the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' accepts to assign to the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' may take the form of:')
                    .moveDown()
                    .text('        · Sounds, music')
                    .moveDown()
                    .text('        · Video')
                    .moveDown()
                    .text('        · Video editing')
                    .moveDown()
                    .text('        · Music composition')
                    .moveDown()
                    .text('        · Images')
                    .moveDown()
                    .text('        · Drawing and editing')
                    .moveDown()
                    .text('        · Logos')
                    .moveDown()
                    .text('        · Visual interfaces')
                    .moveDown()
                    .text('        · Audiovisual equipment')
                    .moveDown()
                    .text('        · Voice recording')
                    .moveDown()
                    .font('Times-Roman')
                    .text('By the present contract, the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' guarantees that the content is not contrary to the public policy rules and to the good morals. In any case, the content transmitted will be regularly controlled and the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('  has the right to refuse it. In case of refusal, none of the rules of this contract shall apply.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' reserves the right to refuse the Content submitted by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" if it doesn't respect the selection criteria of ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" (duration, story, editing, quality, etc).")
                    .moveDown()
                    .text('The ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' warrants that the content does not contain any viruses or anything dubious or suspicious and detrimental to ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(". As the ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(', you always have the option to continue broadcasting the Content on your personal accounts on social networks such as Facebook, YouTube, Instagram or Snapchat for personal use.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        2. THE RIGHTS ASSIGNED')
                    .moveDown()
                    .font('Times-Roman')
                    .text('The ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' guarantees that the Content has not been assigned to third parties inthe past and will not be assigned in the future.')
                    .moveDown()
                    .text('The Parties agree that the rights of the content are assigned by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" on an exclusive basis for direct or indirect exploitation, including for commercial use by the ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' becomes the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" of all exploitation rights of the ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' on the content, meaning the reproduction rights, representation, secondary and derived uses of the content.')
                    .moveDown()
                    .text('The reproduction right includes notably:')
                    .moveDown()
                    .text('- the right to reproduce or to have reproduced, to record or to have recorded by all known or unknown technical processes to this date, on all known or unknown supports to this date, in all formats;')
                    .moveDown()
                    .text('- the right to establish or have established, to exploit or have exploited the Contents, in all formats and by all known or unknown processes to this date;')
                    .moveDown()
                    .text('- the right to translate, arrange, modify, adapt and transform all or part in any form of the Content;')
                    .moveDown()
                    .text('- the right to put or have put into circulation and to exploit or have exploited the Contents on all supports.')
                    .moveDown()
                    .text('The right of representation includes notably the right to represent or have represented the Contents to the public in whole or in part, by any existing or to be discovered means of communication, notably via the social networks Instagram and TikTok.')
                    .moveDown()
                    .text('The right of adaptation includes notably the right to modify and adapt the Content.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        3. THE COUNTERPART OF THE ASSIGNMENT IN A FORM OF CREDIT(VISIBILITY)')
                    .moveDown()
                    .font('Times-Roman')
                    .text('In counterpart of all exclusive rights assigned by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(', the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" offers the visibility to the ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" on the " + ' Okayemotions "' + " social networks accounts  where the Contents are published. However, the present Contract is not monetized and doesn't give rise to any financial consideration.")
                    .moveDown()
                    .text('To this day, the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' uses only the social networks Instagram and TikTok, but ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' reserves the right to publish the Content on other social networks in the future.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        4. DURATION OF THE RIGHTS ASSIGNED')
                    .moveDown()
                    .font('Times-Roman')
                    .text("The rights listed in Article 2 of the Contract are assigned from the date of signature of this Contract for the duration of copyright protection (during the author's lifetime and 70 years after his death).")
                    .moveDown()
                    .font('Times-Bold')
                    .text('        5. END OF THE CONTRACT')
                    .moveDown()
                    .font('Times-Roman')
                    .text('The Contract is concluded for the entire duration of the copyright protection.')
                    .moveDown()
                    .text('In case one of one of the Parties wishes to terminate the Contract, he must inform the other Party by writing within a period of at least 30 days. You will find a file in PDF format (Annex n°1) to be filled in and sent to us by e-mail at the following address: ', {
                        //here it is, 
                        continued: true
                    })
                    .fillColor('blue')
                    .text('​contact@okayemotions.com​.')
                    .fillColor('black')
                    .moveDown()
                    .text('The Contract may also be terminated by mutual consent. The termination of the Contract must be confirmed by e-mail by both parties to the Contract. You agree that we can use your email address to send you this notification.')
                    .moveDown()
                    .text('In the case of a breach of contract by either ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Party', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to the Contract, ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' will cease any further publication of the assigned Content 30 days after confirmation of such agreement; notwithstanding the foregoing, the Content can continue to remain on our pages, and possibly monetized.')


                    .moveDown()
                    .text('All agreements relating to the Content ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('that began prior to the termination date', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' will continue beyond the termination date.')
                    .moveDown()
                    .text('If you fail to comply with any term of this agreement, we may terminate this agreement.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        6. TERRITORIALITY')
                    .moveDown()
                    .font('Times-Roman')
                    .text('The assignment of rights is consented for the entire world.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        7. CLAIM')
                    .moveDown()

                    .font('Times-Roman')
                    .text('For any claim or inconvenience, we kindly ask you to contact us at the following email address: ', {
                        //here it is, 
                        continued: true
                    })
                    .fillColor('blue')
                    .text('​contact@okayemotions.com​.')
                    .fillColor('black')
                    .moveDown()
                    .text('In return of your request, you will receive a confirmation and return by e-mail to your personal address.')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        8. GUARANTEE')
                    .moveDown()
                    .font('Times-Roman')
                    .text('The ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' guarantees to the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" the full and free enjoyment of the rights assigned, against any and all troubles, claims and evictions. The ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' declares that he is the author of the content and declares that, where applicable, he has concluded a contract of assignment of image rights with the persons appearing in the content, which covers the use made of it by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' The ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' guarantees that the contents are entirely original and do not contain any borrowed work of any nature whatsoever, which would be susceptible of directly or indirectly engaging the responsibility of the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('.')
                    .moveDown()
                    .font('Times-Roman')
                    .text('In particular, if the content contains any distinctive signs of any kind whatsoever, illustrations, texts, tables, graphics, photographs, trademarks, and/or other elements belonging to third parties, the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' undertakes to have obtained in advance of the effective date of the assignment all necessary authorizations for their use by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" within the framework of the present contract. The ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' guarantees the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' against its personal actions and against any claim or eviction of any kind (in particular, any action for counterfeit, copyright infringement, plagiarism or unfair competition) that may be brought against the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' by a third party, having as its basis and/or origin the exploitation of the content, the present assignment of the rights to this content, their reproduction by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' under the conditions of the present contract, and in any other form, the execution of this contract. In this respect, the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' undertakes to reimburse the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' for all indemnification that the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" would be ordered to pay as well as the attorney's fees that the ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignee', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" would have to incur in order to organize its defense in this respect.")
                    .moveDown()
                    .font('Times-Bold')
                    .text('        9. APPLICABLE LAW AND THE COMPETENT JURISDICTION')
                    .moveDown()
                    .font('Times-Roman')
                    .text('The present contract is to be governed for all purposes by and construed in accordance with the governing law of French.')
                    .moveDown()
                    .text('An amicable phase is advocated before any judicial proceedings by the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Parties', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to the Contract. As a ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Party', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" to the Contract, in case of disagreement or problem the ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-BoldItalic')
                    .text('Assignor', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(" undertakes to contact ", {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' via the PDF form attached to the Contract and to send a claim before initiating any judicial proceedings.')
                    .moveDown()
                    .text('In case of any dispute in relation to the present Contract, the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Parties', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' attribute anexclusive competence to the jurisdictions of Paris (French).')
                    .moveDown()
                    .font('Times-Bold')
                    .text('        10. SIGNATURE AND PERSONAL INFORMATION')
                    .moveDown()
                    .font('Times-Roman')
                    .text('By signing the present contract you affirm that you have taken knowledge of the preceding provisions. You assign your intellectual property rights relating to the content ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('exclusively', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' to the ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions company', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text('.')
                    .moveDown()
                    .text('You must mention your last name, first name, e-mail address, and an electronic signature will be requested. You also attest that these informations are yours and exclude ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' from any responsibility in case of usurped identity and information.')
                    .moveDown()
                    .text('Automatically after the electronic signature of the Contract a file containing the personal information that you have shared with ', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Bold')
                    .text('Okayemotions', {
                        //here it is, 
                        continued: true
                    })
                    .font('Times-Roman')
                    .text(' will be generated. We commit ourselves to not share this personal information with third parties and to limit their use to a strictly professional purpose.')
                    .moveDown()
                    .text("In particular, your personal information will be used in the case of a dispute relating to the Content to demonstrate your right of authorship of the Content.")
                    .moveDown()
                    .font('Times-Bold')
                    .text('ANNEX N°1 :')
                    .text('CLAIM/TERMINATION FORM', {
                        underline: true,
                        link: "/annexe",
                    })
                    .addPage()
                    .font('Times-Roman')
                    .font('Times-Italic')
                    .moveDown()
                    .moveDown()
                    .font('Times-Italic')
                    .text(firstName + " " + lastName)
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('Full Legal Name')
                    .moveDown()
                    .moveDown()
                    .image(signature, {
                        fit: [200, 200],
                    })
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('My Signature')
                    .moveDown()
                    .moveDown()
                    .font('Times-Italic')
                    .text(year + "-" + month + "-" + _date)
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('Date')
                    .moveDown()
                    .moveDown()
                    .font('Times-Italic')
                    .text(email)
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('My Email Adress')
                    .moveDown()
                    .moveDown()
                    .font('Times-Italic')
                    .text(name)
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('Clip URL or Filename')




                    .moveDown()
                    .moveDown()
                    .font('Times-Italic')
                    .text(city)
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('Was recorded in')


                    
                    .moveDown()
                    .moveDown()
                    .font('Times-Italic')
                    .text(date)
                    .text(`                                                              `, {
                        underline: true,
                    })
                    .font('Times-Roman')
                    .text('Was recorded the');
                doc.end();
                query("INSERT INTO public.data (fname, lname, email, vname, credit, platform, link, type, ext, description, tag, storage, city, date) values('" + firstName + "', '" + lastName + "', '" + email + "', '" + name + "', '" + credit + "', '" + plateform + "', '" + link + "', 'link', 'link', '" + description + "', '" + tag + "', '" + id + "', '" + city + "', '" + date + "')", [], (err, rows) => {
                    res.redirect('thanks');
                });
            }
        })
    }
});


router.post('/delete', (req, res) => {
    const { ID } = req.body;
    let errors = [];
    let folder;

    console.log(ID);
    query("SELECT * FROM public.data WHERE id=" + ID + ";", [], (err, rows) => {
        if (err) {
            errors.push({
                msg: "ID does not exists"
            })
            res.status(400).send({
                errors,
                success: false
            });
        } else {
            folder = rows[0].storage;
            query("DELETE FROM public.data WHERE id=" + ID + ";", [], (err, rows) => {
                if (err) {
                    errors.push({
                        msg: "Error trying to delete data"
                    })
                    res.status(300).send({
                        errors,
                        success: false
                    });
                } else {
                    console.log(folder);
                    fs.rmdirSync("uploads/" + folder + "/", { recursive: true, force: true });
                    res.status(200).send({
                        msg: "Great Success",
                        success: true
                    });
                }
            });
        }
    });

});





















router.get('/annexe', (req, res) => {
    res.sendFile(path.resolve('public/30-days-notice.pdf'));
});

router.get('/lca', (req, res) => {
    res.sendFile(path.resolve('public/Licensing-agreement-ENGLISH.pdf'));
});

router.get('/ppo', (req, res) => {
    res.sendFile(path.resolve('public/Privacy-Policy-for-Okayemotions.pdf'));
});

router.get('/tc', (req, res) => {
    res.sendFile(path.resolve('public/Terms-and-Conditions.pdf'));
});

router.get('/', (req, res) => {
    console.log(req.device.type.toUpperCase());
    res.render('form', {
        platform: req.device.type.toUpperCase()
    });

});
router.get('/thanks', (req, res) => {
    res.render('thanks');

});

router.get('/data', ensureAuthenticated, (req, res) => {
    query("SELECT * from public.data", [], (err, rows) => {
        if (err) return console.log(err);

        rows.forEach(function(obj) { obj.description = obj.description.replace(/'/g, " ");console.log(obj.description) });
        let info = disk.checkSync(_path);
        console.log(info.available);
        console.log(info.free);
        console.log(info.total);
        res.render('data', {
            data: rows,
            size: info.available
        });
    });
});

router.get('/watch', ensureAuthenticated, (req, res) => {
    res.render('video');
});

router.get("/video", ensureAuthenticated, function (req, res) {
    console.log(req.query);
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const videoPath = `uploads/${req.query.storage}/${req.query.video}`;
    const videoSize = fs.statSync(`uploads/${req.query.storage}/${req.query.video}`).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});


router.get('/download', ensureAuthenticated, (req, res) => {
    res.download(`uploads/${req.query.storage}/${req.query.video}`);
});

router.get('/contract', ensureAuthenticated, (req, res) => {
    let storage = req.query.storage;
    console.log(path.resolve(`uploads/${storage}/contrat.pdf`))
    res.sendFile(path.resolve(`uploads/${storage}/contrat.pdf`));
});

module.exports = router;