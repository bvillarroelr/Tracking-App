# Generated by Django 5.2.1 on 2025-06-10 14:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tracking_system', '0002_alter_estado_entrega_options_alter_paquete_options_and_more'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='estado_entrega',
            table='estado_entrega',
        ),
        migrations.AlterModelTable(
            name='paquete',
            table='paquete',
        ),
        migrations.AlterModelTable(
            name='ruta',
            table='ruta',
        ),
        migrations.AlterModelTable(
            name='usuario',
            table='usuario',
        ),
    ]
