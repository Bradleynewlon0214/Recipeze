export function stringsMatch(stringA, stringB){
    return stringA === stringB;
}

export function stringLengthMatch(stringA, stringB){
    return stringA.length === stringB.length;
}

export function stringsMinLength(stringA, stringB, minLength){
    return stringA.length >= minLength && stringB.length >= minLength;
}

export function stripTags(str){
    return str.replace(/<[^>]*>?/gm, '');
}

export function addSlashes(str){
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u00/g, '\\0');
}

export function validUrl(url){
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// export function getHost(url){
//     var pattern = new RegExp(/(?:([^\:]*)\:\/\/)?(?:([^\:\@]*)(?:\:([^\@]*))?\@)?(?:([^\/\:]*)\.(?=[^\.\/\:]*\.[^\.\/\:]*))?([^\.\/\:]*)(?:\.([^\/\.\:]*))?(?:\:([0-9]*))?(\/[^\?#]*(?=.*?\/)\/)?([^\?#]*)?(?:\?([^#]*))?(?:#(.*))?/);
//     if(validUrl(url)){
//         return pattern.exec(url)[5];
//     }
// }

export function specialCharacters(str){
    var format = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
    return format.test(str);
}

export function stringLessThanMax(string, max){
    return string.length < max;
}

export function stringGreaterThanMin(string, min){
    return string.length > min;
}

export function validateCommentData(username, comment){
    if(!stringLessThanMax(username, 250)){
        return [false, "Username must be less than 250 characters!"];
    }
    if(!stringGreaterThanMin(username, 0)){
        return [false, "Username must not be empty!"];
    }
    if(!stringLessThanMax(comment, 1000)){
        return [false, "Comment must be less than 1000 characters!"];
    }
    if(!stringGreaterThanMin(comment, 0)){
        return [false, "Comment must not be empty!"];
    }
    return [true, "Comment data valid"];
}

export function validatePassword(passOne, passTwo, minLength){
    if(!stringsMatch(passOne, passTwo)){
        return "Passwords do not match!";
    }
    if(!stringLengthMatch(passOne, passTwo)){
        return "Passwords are not of the same length!";
    }
    if(!stringsMinLength(passOne, passTwo, minLength)){
        return `Password must at least ${minLength} characters long!`;
    }
    if(!specialCharacters(passOne) && !specialCharacters(passTwo)){
        return "Password must contain at least one special character!";
    }
    return "Your password meets the requirements!";
}