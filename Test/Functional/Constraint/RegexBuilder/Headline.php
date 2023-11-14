<?php

namespace MageSuite\ContentConstructorAdmin\Test\Constraint\RegexBuilder;

class Headline implements \MageSuite\ContentConstructorAdmin\Test\Constraint\AssertionRegexBuilder
{
    /**
     * @param $component \MageSuite\ContentConstructorAdmin\Test\Fixture\Headline
     * @return string
     */
    public function buildRegex($component)
    {
        $subtitle = $component->getSubtitle() == null ? '' : $component->getSubtitle();

        return $component->getTitle() . '(.*?)' . $subtitle;
    }
}
