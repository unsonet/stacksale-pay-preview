let promotionData = {
  "name": "Test Promotion - Max Attendees",
  "promotionText": "<p>Testing of \"max attendees\" values which is set to 10 per promotion date.</p>",
  "contactName": "John Doe",
  "contactEmail": "john.doe@site.com",
  "contactPhone": "+971555555555",
  "footerText": "",
  "customCSS": ".title{color:red}",
  "customJS": "console.log('customJS injected')",
  "enabled": true,
  "categories": [
    {
      "id": 4772,
      "name": "Category One",
      "description": "<p>Category 1.</p>",
      "showHeadings": true,
      "questions": [
        {
          "dateQuestion": {
            "id": 4773,
            "title": "Date",
            "description": "<p>Date question...</p>",
            "showHeadings": true,
            "mandatory": false,
            "basePrices": {
              "sunday": 200,
              "monday": 200,
              "tuesday": 200,
              "wednesday": 200,
              "thursday": 200,
              "friday": 200,
              "saturday": 200
            },
            "pricingMethod": "perDay",
            "selectMultipleType": "arbitraryDates",
            "buyMultiple": {
              "minimum": 1,
              "maximum": 0
            },
            "attendeeCountIncrement": 2,
            "tags": {
              "isAttendanceDate": true,
              "addsToAttendeeCount": true
            }
          }
        }
      ]
    },
    {
      "id": 4774,
      "name": "Personal Info.",
      "description": "Required personal information:",
      "showHeadings": true,
      "questions": [
        {
          "shortTextQuestion": {
            "id": 4775,
            "title": "First Name",
            "description": "Your first name",
            "showHeadings": true,
            "mandatory": true,
            "contentType": "text"
          }
        },
        {
          "shortTextQuestion": {
            "id": 4776,
            "title": "Last Name",
            "description": "Your surname",
            "showHeadings": true,
            "mandatory": true,
            "contentType": "text"
          }
        },
        {
          "shortTextQuestion": {
            "id": 4777,
            "title": "Email",
            "description": "Your email address",
            "showHeadings": true,
            "mandatory": true,
            "contentType": "emailAddress"
          }
        },
        {
          "shortTextQuestion": {
            "id": 4778,
            "title": "Phone",
            "description": "Your phone number",
            "showHeadings": true,
            "mandatory": false,
            "contentType": "text"
          }
        }
      ]
    }
  ],
  "id": 4770,
  "hotel": {
    "id": 2480,
    "name": "Stacksale Pay Demo Hotel",
    "currency": "AED",
    "currencyFormat": "#,####,##0.00"
  },
  "department": {
    "id": 1494
  },
  "displayTemplate": {
    "id": 2755,
    "name": "Default Template",
    "description": "The default Promotions display template"
  },
  "promotionDates": {
    "recurringDates": {
      "firstDates": [
        "2026-05-15"
      ],
      "lastDate": "2026-05-21",
      "recurrencePeriod": "days",
      "recurrenceInterval": 1,
      "enabledDays": [
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY"
      ]
    }
  },
  "maxAttendeesPerDate": 10,
  "notifyEmails": [
    "hotelManager@site.com"
  ],
  "blockedDates": {},
  "uuid": "26a416cd-905b-4276-a814-b6c0fd41cd21",
  "promotionLink": "https://site.com/promotion/view/26a416cd-905b-4276-a814-b6c0fd41cd21",
  "createdBy": {
    "id": 2551,
    "username": "Phil",
    "firstName": "Phil",
    "lastName": "Duhs"
  }
};


document.addEventListener('DOMContentLoaded', (e) => {


  let preview = new StacksalePayPreview({
    promotionData,
    previewElement: '#promotion',
    //previewTemplate //The template can also be passed as an html string.
    morphing: true,
    saveInputStates: true
  });


  let previewAccept = false;
  console.log("PREVIEW INSTANCE", preview);

  document.querySelector('#promotion').addEventListener("template-updated", async (e) => {
    let _this = preview;

    let updateData = (() => {
      //old:
      // try {
      //   _this.updatePreviewOptionsHtml(); //updates the contents of the form
      //   await _this.updatePreview(); //updates the template
      // } catch (error) {
      //   //console.log('ERROR',error)
      // }
      _this.updateData();
    })

    //acceptT&C checkbox handling
    let accept = _this.preview.nativeElement.querySelector('[name="acceptT&C"]');
    accept.checked = previewAccept;
    accept.addEventListener('change', async (event) => {
      previewAccept = event.target.checked;
      updateData();
    });

    //".payPreAuthButton" handling
    let payPreAuthButtons = [..._this.preview?.nativeElement?.querySelectorAll(".payPreAuthButton")];
    if (_this.previewAnswersValidation.valid && _this.previewAccept) {
      payPreAuthButtons.forEach(item => item.classList.remove('disabled'));
    } else {
      payPreAuthButtons.forEach(item => item.classList.add('disabled'));
    }
    payPreAuthButtons.forEach(item => {
      item.addEventListener('click', async (event) => {
        event.preventDefault();
        let input = event.target;
        let valid = _this.previewAnswersValidation.valid && !input.classList.contains('disabled');
        if (valid) {
        } else {
          _this.validationTouchAll(); //highlights invalid form elements
          console.log('CLICK');
          updateData();
        }
        //dispatch event "template-submit"
        _this.preview.nativeElement.dispatchEvent(new CustomEvent("template-submit", {
          bubbles: true,
          detail: promotionDetail
        }));
      })
    });
  });
});