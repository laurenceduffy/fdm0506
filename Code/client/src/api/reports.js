import axios from 'axios';
import FileDownload  from 'js-file-download';

const downloadStockReport = async (token, symbols, fileType, order) => {
    const requestOptions = {
        url: 'http://localhost:3333/report/stocks',
        method: 'post',
        data: {
            symbols,
            fileType,
            order
        },
        headers: {
            Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
    };

    return await axios(requestOptions)
        .then(data => {
            const timestamp = (new Date()).toISOString();
            FileDownload(data.data, `stock_snapshot_${timestamp}.${fileType}`);
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

const downloadUserReport = async (token, fileType, order) => {
    const requestOptions = {
        url: 'http://localhost:3333/report/user',
        method: 'post',
        data: {
            fileType,
            order
        },
        headers: {
            Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
    };

    return await axios(requestOptions)
        .then(data => {
            const timestamp = (new Date()).toISOString();
            FileDownload(data.data, `user_snapshot_${timestamp}.${fileType}`);
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export { downloadStockReport, downloadUserReport }