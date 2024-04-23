const { error } = require("console");
const fs = require("fs");
const zlib = require('zlib');

function CreateFileFunc(){
    let path = "./files/fresh.txt";
    let textin = "«Свіжий і бадьорий»\n"
    // let fileEx = 0;
    // перевірка на існування файлу
    // fs.readFileSync(path, function(error,data){
    //     if(error){
    //         fileEx = 1;
    //         console.log(fileEx)
    //     }
    //     else{
    //         return console.log("CREATE operation failed")
    //     }
    // });
    if (fs.existsSync(path)){
        return console.log("CREATE operation failed")
    }
    else{
        fs.mkdir('./files',(error) => {if(error)return console.log("CREATE operation failed: ", error);})
        fs.writeFileSync(path, textin, function(error){
            if(error){
                return console.log("CREATE operation failed: ", error);
            }
        
        });
    }

    return 
};

function CopyFilesFunc(){
    let copyPath = "./files";
    let path = "./files_copy"
    let dirEx = 0
    
    // чи існує каталог копія
    // fs.readdir(path, (error) => {
    //     if(error) {
    //         dirEx = 1
    //     }
    //     else{
    //         return console.log("COPY operation failed 1");
    //     }
    // });
    // console.log(dirEx)
        
    // if(dirEx === 1){
    // fs.readdir(copyPath, (error, files) => {
    //     if(error) return console.log("COPY operation failed 1")
    // });
    if(!fs.existsSync(path) && fs.existsSync(copyPath)){
        fs.mkdir(path,(error) => {
            if(error){
                return console.log("COPY operation failed 2");
            }
            // чи існує каталог files
            fs.readdir(copyPath, (error, files) => {
                if(error) return console.log("COPY operation failed 3");
                else{
                    const filesList = files;
                    for(let i = 0; i < filesList.length;i++){
                        fs.copyFile(copyPath + "/" + filesList[i],path + "/" + filesList[i], (error) => {
                            if(error) return console.log("COPY operation failed 4 ");
                            else{
                                console.log("File " + i +" copy successful");
                            }
                        })
                    }
                }
            }
        )
        });

    return console.log("Сopying was successful");
    }
    else {
        return console.log("COPY operation failed 5 ");
    }
};

function RenameFileFunc(oldFileName,newFileName){
    let path = "./files";
    fs.rename(path + "/" + oldFileName,path + "/" + newFileName,(error) => {
        if(error) return console.log("RENAME operation failed")
        else return console.log("RENAME operation successful")
    })
};

function DeleteFileFunc(fileName){
    let path = "./files";
    fs.unlink(path + "/" + fileName, (error) =>{
        if(error) return console.log("DELETE operation failed")
        else return console.log("DELETE operation successful")
    })
    
};

function ListFilesFunc(){
    let path = "./files";
    fs.readdir(path, (error, files) => {
        if(error) return console.log("LIST operation failed")
        else{
            const filesList = files;
            console.log("Files in directory: {")
            for(let i = 0; i < filesList.length;i++){
                console.log(filesList[i]);
            }
            console.log("} ")
        }
    });
    return console.log("LIST operation successful")
};

function ReadFileFunc(fileName){
    let path = "./files";
    fs.readFile(path+'/'+fileName,(error,data) =>{
        if(error) return console.log('READ operation failed')
        else console.log(data.toString());
    })
    return console.log('READ operation successful')
};

function ReadStreamFunc(fileName){
    let path = "./files/"+fileName;
    let readStream = fs.createReadStream(path);
    // чи існує
    if (!fs.existsSync(path)) {
        return console.error('READ STREAM operation failed'); 
    }
    
    readStream.on('error', (error) => {
        return console.error('READ STREAM operation failed: ', error);
    });

    readStream.on('data', (chunk) => {
        console.log(chunk.toString());
    });
    readStream.on('end', () => {
        console.log('READ STREAM operation completed');
    });
    return;
};

function WriteStreamFunc(fileName,text){
    let path = "./files/"+fileName;
    
    if (fs.existsSync(path)) {
        console.error('WRITE STREAM operation failed');
        return;
    }
    let writeStream = fs.createWriteStream(path);
    writeStream.write(text, 'utf-8', (error) => {
        if (error) {
            console.error('WRITE STREAM operation failed:', error);
            return;
        }
        console.log('WRITE STREAM operation ');
    });

    writeStream.on('finish', () => {
        console.log('WRITE STREAM operation completed');
    });

    writeStream.end();
    return;
};

function CompressFunc(fileName){
    let path = "./files/"+fileName;
    let targetPath = './archives/archive.gz';
    
    if (!fs.existsSync(path)) {
        return console.error('COMPRESS operation failed 1');
    }

    if (fs.existsSync(targetPath)) {
        return console.error('COMPRESS operation failed 2');
    }
    else {
        fs.mkdir("./archives",(error)=>{
            if(error) return console.error('COMPRESS operation failed 3',error)
        })
    }
    // Створення Readable Stream для вихідного файлу
    let readStream = fs.createReadStream(path);
    // Створення Writable Stream для стиснутого файлу
    let writeStream = fs.createWriteStream(targetPath);
    // Створення потоку для стиснення за допомогою модуля zlib
    let gzip = zlib.createGzip();
    // Перенаправлення даних з Readable Stream в модуль стиснення
    // і з модуля стиснення в Writable Stream
    readStream.pipe(gzip).pipe(writeStream);

    writeStream.on('finish', () => {
        console.log('File compression complete');
    });
    
    readStream.on('error', (error) => {
        console.error('COMPRESS operation failed:', error);
    });
    return;
};

function DecompressFunc(){
    let filePath = './archives/archive.gz';
    let targetFilePath = './files/decompressedFile.txt';

    if (!fs.existsSync(filePath)) {
        return console.error('DECOMPRESS operation failed');
    }
    if (fs.existsSync(targetFilePath)) {
        return console.error('DECOMPRESS operation failed');
    }
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(targetFilePath);

    // Створення потоку для розпакування  zlib
    const gunzip = zlib.createGunzip();
    readStream.pipe(gunzip).pipe(writeStream);

    writeStream.on('finish', () => {
        console.log('Unpacking the archive is complete.');
    });

    readStream.on('error', (error) => {
        console.error('DECOMPRESS operation failed:', error);
    });
    return;

};

const oldFileName = "wrongFilename.txt"
const newFileName = "properFilename.md"
const fileNameD = 'fileToDelete.txt'
const fileName = 'fresh.txt'
const text ="Дуже свіжий!!!"
const fileNameС = 'CompresFile.txt'

CreateFileFunc()

CopyFilesFunc()

RenameFileFunc(oldFileName,newFileName)

DeleteFileFunc(fileNameD)

ListFilesFunc()

ReadFileFunc(fileName)

ReadStreamFunc(fileName)

WriteStreamFunc("MaxFresh.txt",text)

CompressFunc(fileNameС)

DecompressFunc()