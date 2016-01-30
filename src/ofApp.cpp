#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    img.load("road.jpg");
    shader.load("shader");
    vid.initGrabber(480, 320);

    sigma_gauss.set("sigma_gauss", 7.0f, 0.0001f, 10.0f);
    sigma_color.set("sigma_color", 0.1f, 0.01f, 0.2f);
    shader_select.set("select", 0, 0, 2);
    
    gui = new ofxDatGui();
    gui->addSlider(sigma_gauss);
    gui->addSlider(sigma_color);
    gui->addSlider(shader_select);
    gui->onSliderEvent(this, &ofApp::onSliderEvent);
}

//--------------------------------------------------------------
void ofApp::update(){
    vid.update();
}

//--------------------------------------------------------------
void ofApp::draw(){
    shader.begin();
   
    shader.setUniform1f("sigma_gauss", sigma_gauss);
    shader.setUniform1f("sigma_color", sigma_color);
    shader.setUniform1i("select", shader_select);
    vid.draw(0, 0);
    //img.draw(0, 0);
    
    shader.end();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == 'r') {
        shader.load("shader");
    }
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}

//--------------------------------------------------------------
void ofApp::onSliderEvent(ofxDatGuiSliderEvent e)
{
}
