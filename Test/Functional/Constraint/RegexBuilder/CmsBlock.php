<?php


namespace MageSuite\ContentConstructorAdmin\Test\Constraint\RegexBuilder;


class CmsBlock implements \MageSuite\ContentConstructorAdmin\Test\Constraint\AssertionRegexBuilder
{
    /**
     * @param $component \Magento\Cms\Test\Fixture\CmsBlock
     * @return string
     */
    public function buildRegex($component)
    {
        return $component->getContent();
    }
}
