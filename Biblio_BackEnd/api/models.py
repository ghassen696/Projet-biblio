from djongo import models

class Ressource(models.Model):
    N = models.IntegerField()
    BIBID = models.IntegerField()
    ITEMID = models.IntegerField()
    code_barre = models.CharField(max_length=255)
    creation_date = models.DateField()
    modif_date = models.DateField()
    cote = models.CharField(max_length=255)
    inventaire = models.CharField(max_length=255)
    titre = models.CharField(max_length=255)
    auteur = models.CharField(max_length=255)
    staff_note = models.CharField(max_length=255)
    isbn_a = models.CharField(max_length=255)
    item_class = models.CharField(max_length=255)
    nb_page = models.CharField(max_length=255)
    date_edition = models.IntegerField()
    editeur = models.CharField(max_length=255)
    prix = models.CharField(max_length=255)

    def __str__(self):
        return self.titre 
