<?php

namespace MageSuite\ContentConstructorAdmin\Test\Assets;

class MediaDeployer
{
    public function deploy($fileName)
    {
        $mediaFolder = realpath(__DIR__ . '/../../../../../../pub/media/wysiwyg');
        $assetsFolder = realpath(__DIR__ . '/Media');

        copy($assetsFolder . '/' . $fileName, $mediaFolder . '/' . $fileName);
    }
}