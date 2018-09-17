<?php

namespace MageSuite\ContentConstructorAdmin\Template;

class Locator implements \MageSuite\ContentConstructor\View\AdminTemplateLocator
{
    private function getBasePath() {
        return realpath(__DIR__.'/../');
    }

    public function locate($path) {
        $path = self::getBasePath() . '/../creative-patterns/packages/' . $path;

        return $path;
    }
}
