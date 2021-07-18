import axios from 'axios';

import React, {Component} from 'react';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {Circle} from 'rc-progress';
import RotateLeftIcon from "@material-ui/core/SvgIcon/SvgIcon";
import icons from '../../icons';
import Fab from "@material-ui/core/Fab";

class UpFile extends Component {
    constructor() {
        super();
        this.state = {
            // Initially, no file is selected
            onprogress: false,
            progress: 0,
            falhou: false
        };

        // On file select (from the pop up)
        this.onRearm = event => {

            // Update the state
            // this.setState({ selectedFile: event.target.files[0] });

            this.setState({onprogress: false, progress: 0, falhou: false});
        };
        // On file select (from the pop up)
        this.onFileChange = event => {

            // Update the state
            // this.setState({ selectedFile: event.target.files[0] });

            this.setState({onprogress: true, progress: 0, falhou: false});
            const formData = new FormData();

            formData.set("meta",JSON.stringify({origem:'UpFile',...this.props.meta}));
            formData.set(
                "file",
                event.target.files[0],
                event.target.files[0].name
            );
            //todo: ajustar
            axios.post(`${window.API_ROOT}/api/uploads/up`, formData, {
                onUploadProgress: (event) => {
                    let number = Math.round((event.loaded * 100) / event.total);
                    //console.log(`A imagem ${filename} está ${progress}% carregada... `);
                    console.log(`progresso: ${number}`);
                    this.setState({progress: number});
                },
            }).then((response) => {
                //console.log(`A imagem ${filename} já foi enviada para o servidor!`);
                this.setState({onprogress: false, progress: 0});
                //console.log(['resposta ',response]);
                if (this.props.onComplete)
                    this.props.onComplete(response.data);
            })
                .catch((err) => {
                    //console.error( `Houve um problema ao realizar o upload da imagem ${filename} no servidor AWS` );
                    console.log(err);
                    this.setState({falhou: true});
                });
        };

    }

    render() {

        var hasBody = this.props.body?true:false;
        var style=this.props.body ?"btn-upload":"btn-upload-disabled";
        if (!this.state.onprogress) {
            return (
                <div className="upload-btn-wrapper" >
                    <Fab className={style}>
                        <AttachFileIcon/>
                    </Fab>
                    {hasBody && <input type="file" id="myfile" name="myfile" onChange={this.onFileChange}/>}
                </div>
            );
        }
        if (this.state.onprogress && !this.state.falhou) {
            return (
                <div className="upload-progress-wrapper" >
                    <Circle strokeWidth="10" percent={this.state.progress}/>
                </div>
            );
        }
        if (this.state.onprogress && this.state.falhou) {
            return (
                <div className="upload-progresserror-wrapper" onClick={this.onRearm}>
                    Falhou!<br/>
                    {icons.RotateLeftIcon}
                </div>
            );
        }
    }
}

export default UpFile;
