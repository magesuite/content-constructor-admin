<?php

namespace MageSuite\ContentConstructorAdmin\Helper;

class ConfigurationMediaResolver
{
    protected $decodedImageArrayKeys = ['decodedImage', 'decoded_image', 'decoded'];

    /**
     * @var \MageSuite\ContentConstructor\Service\MediaResolver
     */
    protected $mediaResolver;

    public function __construct(\MageSuite\ContentConstructor\Service\MediaResolver $mediaResolver)
    {
        $this->mediaResolver = $mediaResolver;
    }

    public function resolveMedia($configuration) {
        $this->resolveImagesInArray($configuration);

        return $configuration;
    }

    protected function resolveImagesInArray(&$array) {
        if(!is_array($array)) {
            return;
        }

        foreach($array as $key => &$value) {
            if(is_array($value)) {
                $this->resolveImagesInArray($value);
            }

            if(in_array($key, $this->decodedImageArrayKeys) and is_string($value) and $this->isMagentoMediaWidget($value)) {
                $array['image'] = $this->mediaResolver->resolve($value);
            }
        }
    }

    protected function isMagentoMediaWidget($value)
    {
        return preg_match('/{{media .*?}}/', $value);
    }
}
