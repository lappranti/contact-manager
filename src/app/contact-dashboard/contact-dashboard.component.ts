import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Contact } from '../model/contact';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-contact-dashboard',
  templateUrl: './contact-dashboard.component.html',
  styleUrls: ['./contact-dashboard.component.scss'],
})
export class ContactDashboardComponent implements OnInit {
  contactForm!: FormGroup;
  contactList!: Contact[];
  editForm: boolean = false;
  currentContactEditing!: Contact;
  formTitle!: string;

  constructor(private formBuilder: FormBuilder, private api: ApiService) {}
  ngOnInit(): void {
    //Initialisation de la liste de contact
    this.api.getContactList().subscribe({
      next: (list) => (this.contactList = list),
      error: (err) => console.log(err),
    });

    this.handleAddContact();
  }

  handleAddContact() {
    //Form binding
    this.formTitle = 'Nouveau Contact';
    this.editForm = false;
    this.contactForm = this.formBuilder.group({
      nom: this.formBuilder.control(''),
      prenom: this.formBuilder.control(''),
      adresse: this.formBuilder.control(''),
      tel: this.formBuilder.control(null),
      email: this.formBuilder.control(''),
    });
  }

  handleEditeContatc(contact: Contact) {
    this.formTitle = 'Modifié Contact';
    this.editForm = true;
    this.currentContactEditing = contact;
    this.contactForm = this.formBuilder.group({
      nom: this.formBuilder.control(contact.nom),
      prenom: this.formBuilder.control(contact.prenom),
      adresse: this.formBuilder.control(contact.adresse),
      tel: this.formBuilder.control(contact.tel),
      email: this.formBuilder.control(contact.email),
    });
  }

  handleAddForm() {
    this.api.postContact(this.contactInitialisize('add')).subscribe({
      next: (res) => {
        this.contactList.push(res);
      },
      error: (err) => console.log(err),
    });
  }

  handleEditeForm() {
    this.api.putContact(this.contactInitialisize('edite')).subscribe({
      next: (res) => {
        let currentContact: Contact | undefined = this.contactList.find(
          (p) => p.id == res.id
        );
        if (currentContact) {
          let index: number = this.contactList.indexOf(currentContact);
          this.contactList[index] = res;
        }
      },
      error: (err) => console.log(err),
    });
  }

  handleDeleteContact(contact: Contact) {
    if (confirm('Confirmer la suppression !')) {
      this.api.dalateContact(contact).subscribe({
        next: (res) => {
          this.contactList = this.contactList.filter((p) => p.id != contact.id);
        },
      });
    }
  }

  contactInitialisize(form: string) {
    let contact: any = this.contactForm.value;

    if (form == 'add') {
      contact.id = UUID.UUID();
    } else {
      contact.id = this.currentContactEditing.id;
    }

    return contact;
  }
}
