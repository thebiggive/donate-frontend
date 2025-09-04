#!/bin/bash

# Fix line 229
sed -i '229s/this.stepper.(selected && selected.label)/this.stepper.selected \&\& this.stepper.selected.label/g' /home/barney/projects/donate-frontend/src/app/regular-giving/regular-giving.component.ts

# Fix line 570
sed -i '570s/this.(homePostcode && homePostcode.trim)() && !this.(billingPostCode && billingPostCode.trim)()/this.homePostcode \&\& this.homePostcode.trim() \&\& !(this.billingPostCode \&\& this.billingPostCode.trim())/g' /home/barney/projects/donate-frontend/src/app/regular-giving/regular-giving.component.ts

# Fix line 632
sed -i '632s/this.mandateForm.controls.aged18OrOver.(errors && errors.required)/this.mandateForm.controls.aged18OrOver.errors \&\& this.mandateForm.controls.aged18OrOver.errors.required/g' /home/barney/projects/donate-frontend/src/app/regular-giving/regular-giving.component.ts

# Fix line 720
sed -i '720s/this.(homePostcode && homePostcode.match)(postcodeRegExp)/this.homePostcode \&\& this.homePostcode.match(postcodeRegExp)/g' /home/barney/projects/donate-frontend/src/app/regular-giving/regular-giving.component.ts

echo "Fixed optional chaining in regular-giving.component.ts"
