<?php

namespace MageSuite\ContentConstructorAdmin\Test\Constraint;

class AssertionRegexBuilderFactory
{
    /**
     * @param $componentType
     * @return AssertionRegexBuilder
     */
    public function create($componentType)
    {
        $className = 'MageSuite\ContentConstructorAdmin\Test\Constraint\RegexBuilder\\'.ucfirst($componentType);

        return new $className;
    }
}