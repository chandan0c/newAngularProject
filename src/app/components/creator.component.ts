import { Component, OnInit } from "@angular/core";
import { SurveyCreatorModel } from "survey-creator-core";
import "survey-core/survey.i18n.js";
import "survey-creator-core/survey-creator-core.i18n.js";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";

@Component({
    // tslint:disable-next-line:component-selector
    selector: "component-survey-creator",
    templateUrl: "./creator.component.html",
    styleUrls: ["./creator.component.css"]
})
export class SurveyCreatorComponent implements OnInit {
    model: SurveyCreatorModel;
    ngOnInit() {
        const options = {
            showLogicTab: true
        };
        const creator = new SurveyCreatorModel(options);
        creator.onUploadFile.add(function (_, options) {
            const formData = new FormData();
        
            options.files.forEach(function (file) {
                formData.append(file.name, file);
            });
            fetch("https://api.surveyjs.io/private/Surveys/uploadTempFiles", {
                method: "post",
                body: formData
            }).then((response) => response.json())
                .then((result) => {
                    options.callback(
                        "success",
                        // A link to the uploaded file
                        "https://api.surveyjs.io/private/Surveys/getTempFile?name=" + result[options.files[0].name]
                    );
                })
                .catch((error) => {
                    options.callback('error');
                });
        });
        
        creator.JSON = {
            "elements": [
                {
                    "type": "image",
                    "name": "question1",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
                }
            ]
        };
        
        this.model = creator;
    }
}