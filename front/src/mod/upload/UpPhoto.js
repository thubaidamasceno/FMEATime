import axios from 'axios';
import React, {Component} from 'react';
import ReactModal from 'react-modal';
import {Circle} from 'rc-progress';
import Camera, {FACING_MODES, IMAGE_TYPES} from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import icons, {iconx} from '../../icons';
import adapter from 'webrtc-adapter';
import Fab from "@material-ui/core/Fab";


const logger = window.logger;
console.log(adapter.browserDetails);

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data.replace(RegExp(`^data:${contentType};base64,`), ""));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
};

class UpPhoto extends Component {
    constructor() {
        super();
        this.state = {
            onprogress: false,
            progress: 0,
            falhou: false,
            showModal: false,
            image: '',
            operation: 'closed',
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleTakePhoto = this.handleTakePhoto.bind(this);
        this.cordovaGetPicture = this.cordovaGetPicture.bind(this);
        this.handleRestart = this.handleRestart.bind(this);

        this.handleAcceptPhoto = (e) => {
            //e.preventDefault();
            this.onUpload(this.state.image);
            this.setState({showModal: false, operation: 'closed', image: ''});
        };

        this.onRearm = event => {
            this.setState({onprogress: false, progress: 0, falhou: false});
        };
        this.onUpload = (data) => {
            this.setState({onprogress: true, progress: 0, falhou: false});
            const formData = new FormData();
            formData.set("meta",JSON.stringify({origem:'UpPhoto',...this.props.meta}));
            formData.set(
                "file",
                b64toBlob(data, 'image/jpeg'),
                (Math.random() * Math.pow(36, 8) | 0).toString(36) + '.jpg'
            );
            //todo: ajustar
            axios.post(`${window.API_ROOT}/api/uploads/up`, formData, {
                onUploadProgress: (event) => {
                    let number = Math.round((event.loaded * 100) / event.total);
                    this.setState({progress: number});
                },
            }).then((response) => {
                this.setState({onprogress: false, progress: 0});
                //console.log(['resposta ',response]);
                if (this.props.onComplete)
                    this.props.onComplete(response.data);
            })
                .catch((err) => {
                    this.setState({falhou: true});
                });
        };
    };

    handleOpenModal(e) {
        //e.preventDefault();
        if (window.logger)
            window.logger.info({
                platform: navigator.platform,
                hasCamera: navigator.camera != null,
                platformId: window.cordova ? window.cordova.platformId : 'xxx',
                cameraType: this.props.cameraType
            });
        this.setState({showModal: true, operation: 'capture'});

        if (this.props.cameraType == 'cordova' || this.props.cameraType === 'cordova')
            this.cordovaGetPicture(e);
    }

    UNSAFE_componentWillMount() {
        ReactModal.setAppElement('body');
    }

    handleCloseModal(e) {
        //e.preventDefault();
        this.setState({showModal: false, operation: 'closed'});
    }

    handleRestart(e) {
        //e.preventDefault();
        this.setState({image: '', operation: 'capture'});
    }

    handleTakePhoto(dataUri) {
        this.setState(
            Object.assign({}, this.state, {
                image: dataUri,
            })
        );
        this.setState({operation: 'view'});
    }

    cordovaGetPicture(e) {
        try {
            if (navigator && navigator.camera) {
                navigator.camera.getPicture(
                    this.handleTakePhoto,
                    (message) => {
                        logger.info("Failed because: " + message);
                    },
                    {
                        destinationType: navigator.camera.DestinationType.DATA_URL,
                    }
                );
                // logger.info("cordova aberto");
            } else {
                // logger.info("não rolou");
            }
        } catch (er) {
            // logger.info(["não rolou", er]);
        }
    };

    render() {
        var className, onClick;
        if (!this.state.falhou) {
            className = "upload-btn-wrapper";
        }
        if (this.state.falhou) {
            onClick = this.onRearm;
            className = "upload-progresserror-wrapper";
        }
        var cameraType;
        if ((!this.state.onprogress &&
            navigator != null &&
            navigator.camera != null &&
            navigator.platform.match(/(linux|arm)/gi)) &&
            (window.cordova && window.cordova.platformId !== 'browser'))
            cameraType = 'cordova';
        if ((!this.state.onprogress && (navigator.camera == null ||
            navigator.platform.match(/(win|ios)/gi))) ||
            (window.cordova && window.cordova.platformId === 'browser'))
            cameraType = 'webrtc';

        var hasBody = this.props.body ? true : false;
        var style = hasBody ? "btn-upload" : "btn-upload-disabled";

        return (
            <div className={className} onClick={onClick} style={(cameraType === 'cordova') ? {display: 'none'} : {}}>

                {(!this.state.onprogress && !this.state.falhou) && (
                    < Fab className={style} onClick={hasBody? this.handleOpenModal: () => {
                    }}> {icons.CameraAltIcon} </Fab>
                )}
                {(this.state.onprogress && !this.state.falhou) && (
                    <Circle strokeWidth="10" percent={this.state.progress}/>
                )}
                {(this.state.onprogress && this.state.falhou) && (
                    <span> Falhou!<br/> {icons.RotateLeftIcon} </span>
                )}
                <div className="cam-cordovabox">
                    <ReactModal isOpen={this.state.showModal}
                                className='ReactModal'
                                contentLabel=""
                                style={{overlay: {backgroundColor: 'rgba(0,0,0, 0)'}}}>
                        {(cameraType === 'webrtc' && this.state.operation === 'capture') && (
                            <Camera
                                className="imgcam"
                                onTakePhoto={(dataUri) => {
                                    this.handleTakePhoto(dataUri);
                                }}
                                idealFacingMode={FACING_MODES.ENVIRONMENT}
                                imageType={IMAGE_TYPES.JPG}
                                //imageCompression={0.9}
                                isMaxResolution={true}
                                isSilentMode={true}
                                isFullscreen={false}
                            />
                        )}
                        {(this.state.operation == 'view') &&
                        (<img className="imgcam" id="myImage" alt='' src={this.state.image}/>)}
                        {(this.state.operation == 'view') && (
                            <div orientation="vertical" className="imgcam-btn-box">
                                <Fab className="imgcam-btn" color="secondary"
                                     onClick={this.handleCloseModal}>{icons.DeleteForeverIcon}</Fab>
                                <Fab className="imgcam-btn" color="primary"
                                     onClick={this.handleRestart}>{icons.RotateLeftIcon}</Fab>
                                <Fab className="imgcam-btn" color="primary"
                                     onClick={this.handleAcceptPhoto}>{icons.SendRoundedIcon}</Fab>
                            </div>)}
                        {(this.state.operation == 'capture') && (
                            <div className="imgcam-btn-box">
                                <Fab className="imgcam-btn" color="secondary"
                                     onClick={this.handleCloseModal}>{icons.KeyboardBackspaceIcon}</Fab>
                            </div>)}
                    </ReactModal>
                </div>
            </div>
        );
    }
}

export default UpPhoto;
