from rest_framework import serializers

class LibraryResourceSerializer(serializers.Serializer):
    _id = serializers.CharField()  # MongoDB ID as string
    titre = serializers.CharField(required=False, allow_blank=True)
    auteur = serializers.CharField(required=False, allow_blank=True)
    isbn_a = serializers.CharField(required=False, allow_blank=True)
    item_class = serializers.CharField(required=False, allow_blank=True)
    editeur = serializers.CharField(required=False, allow_blank=True)
    d_creation = serializers.DateTimeField(required=False)
    code_barre = serializers.CharField(required=False, allow_blank=True, allow_null=True)
